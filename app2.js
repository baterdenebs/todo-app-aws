const API_URL = "https://9ai2tn1lhj.execute-api.us-east-1.amazonaws.com";

// Cognito config
const COGNITO_CONFIG = {
    userPoolId: "us-east-1_XXk2S7MG2",
    clientId: "6hhd4mok8f1jjmetsv809gkfcv",
    region: "us-east-1"
};

const COGNITO_URL = `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/`;

let currentUserEmail = "";
let currentToken = "";

// ─── AUTH FUNCTIONS ───────────────────────────────────

async function signup() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;
    const msg = document.getElementById("signup-message");

    // Frontend checks first
    if (!email) {
        msg.className = "message error";
        msg.textContent = "Please enter your email address!";
        return;
    }

    if (password !== confirm) {
        msg.className = "message error";
        msg.textContent = "Passwords do not match!";
        return;
    }

    if (password.length < 8) {
        msg.className = "message error";
        msg.textContent = "Password must be at least 8 characters!";
        return;
    }

    try {
        const response = await fetch(COGNITO_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-amz-json-1.1",
                "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp"
            },
            body: JSON.stringify({
                ClientId: COGNITO_CONFIG.clientId,
                Username: email,
                Password: password,
                UserAttributes: [{ Name: "email", Value: email }]
            })
        });

        if (response.ok) {
            currentUserEmail = email;
            msg.className = "message success";
            msg.textContent = "Account created! Check your email for a verification code.";
            setTimeout(() => showVerify(), 1500);
        } else {
            const error = await response.json();
            msg.className = "message error";

            // Handle specific Cognito errors
            switch(error.__type) {
                case "UsernameExistsException":
                    msg.textContent = "An account with this email already exists. Please sign in instead!";
                    break;
                case "InvalidPasswordException":
                    msg.textContent = "Password must be at least 8 characters and include uppercase, number and symbol!";
                    break;
                case "InvalidParameterException":
                    msg.textContent = "Please enter a valid email address!";
                    break;
                default:
                    msg.textContent = error.message || "Signup failed. Please try again!";
            }
        }
    } catch (error) {
        msg.className = "message error";
        msg.textContent = "Connection error. Please check your internet and try again!";
    }
}
async function verify() {
    const code = document.getElementById("verify-code").value;
    const msg = document.getElementById("verify-message");

    if (!code) {
        msg.className = "message error";
        msg.textContent = "Please enter the verification code!";
        return;
    }

    try {
        const response = await fetch(COGNITO_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-amz-json-1.1",
                "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmSignUp"
            },
            body: JSON.stringify({
                ClientId: COGNITO_CONFIG.clientId,
                Username: currentUserEmail,
                ConfirmationCode: code
            })
        });

        if (response.ok) {
            msg.className = "message success";
            msg.textContent = "Email verified! Redirecting to login...";
            setTimeout(() => showLogin(), 1500);
        } else {
            const error = await response.json();
            msg.className = "message error";

            switch(error.__type) {
                case "CodeMismatchException":
                    msg.textContent = "Wrong verification code. Please check your email and try again!";
                    break;
                case "ExpiredCodeException":
                    msg.textContent = "Code has expired. Please sign up again to get a new code!";
                    break;
                case "TooManyFailedAttemptsException":
                    msg.textContent = "Too many attempts. Please wait a few minutes and try again!";
                    break;
                default:
                    msg.textContent = error.message || "Verification failed. Please try again!";
            }
        }
    } catch (error) {
        msg.className = "message error";
        msg.textContent = "Connection error. Please check your internet and try again!";
    }
}
async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const msg = document.getElementById("login-message");

    const showError = (text) => {
        msg.className = "message error";
        msg.textContent = text;
    }

    const showInfo = (text) => {
        msg.className = "message success";
        msg.textContent = text;
    }

    if (!email) { showError("Please enter your email address!"); return; }
    if (!password) { showError("Please enter your password!"); return; }

    showInfo("Signing in...");

    try {
        const response = await fetch(COGNITO_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-amz-json-1.1",
                "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth"
            },
            body: JSON.stringify({
                AuthFlow: "USER_PASSWORD_AUTH",
                ClientId: COGNITO_CONFIG.clientId,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password
                }
            })
        });

        if (response.ok) {
            const data = await response.json();
            currentToken = data.AuthenticationResult.IdToken;
            currentUserEmail = email;
            msg.className = "message";
            showApp();
        } else {
            const error = await response.json();
            const errorType = error.__type || "";

            switch(errorType) {
                case "NotAuthorizedException":
                    showError("Wrong email or password. Please try again!");
                    break;
                case "UserNotFoundException":
                    showError("No account found with this email. Please sign up first!");
                    break;
                case "UserNotConfirmedException":
                    showError("Please verify your email first. Check your inbox!");
                    currentUserEmail = email;
                    setTimeout(() => showVerify(), 2000);
                    break;
                case "TooManyRequestsException":
                    showError("Too many attempts. Please wait a few minutes!");
                    break;
                default:
                    showError(error.message || "Login failed. Please try again!");
            }
        }
    } catch (error) {
        showError("Connection error. Please check your internet!");
    }
}

function logout() {
    currentToken = "";
    currentUserEmail = "";
    document.getElementById("app-container").style.display = "none";
    document.getElementById("auth-container").style.display = "block";
    showLogin();
}

// ─── UI HELPERS ───────────────────────────────────────

function showSignup() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
    document.getElementById("verify-form").style.display = "none";
}

function showLogin() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("verify-form").style.display = "none";
}

function showVerify() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("verify-form").style.display = "block";
}

function showApp() {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("app-container").style.display = "block";
    document.getElementById("user-email").textContent = `👋 ${currentUserEmail}`;
    
    // Show loading before fetching
    document.getElementById("todoList").innerHTML = "<li>Loading...</li>";
    
    fetchTodos();
}

// ─── TODO FUNCTIONS ───────────────────────────────────

async function fetchTodos() {
    try {
        const response = await fetch(`${API_URL}/todos`, {
            headers: {
                "Authorization": currentToken
            }
        });
        const data = await response.json();
        renderTodos(data.todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}

async function addTodo() {
    const input = document.getElementById("todoInput");
    const text = input.value.trim();
    if (text === "") return;

    try {
        await fetch(`${API_URL}/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": currentToken
            },
            body: JSON.stringify({ text: text })
        });
        input.value = "";
        fetchTodos();
    } catch (error) {
        console.error("Error adding todo:", error);
    }
}

async function deleteTodo(id) {
    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": currentToken
            }
        });
        fetchTodos();
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
}

function renderTodos(todos) {
    const list = document.getElementById("todoList");
    list.innerHTML = "";

    if (todos.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <p>No tasks yet!</p>
                <p>Add your first task above ☝️</p>
            </div>
        `;
        return;
    }

    todos.forEach(todo => {
        const li = document.createElement("li");
        li.className = "todo-item";
        li.innerHTML = `
            <div class="todo-left">
                <div class="todo-checkbox"></div>
                <span class="todo-text">${todo.text}</span>
            </div>
            <button class="todo-delete" onclick="deleteTodo('${todo.id}')">Delete</button>
        `;
        list.appendChild(li);
    });
}
function checkStrength(password) {
    const fill = document.getElementById("strength-fill");
    const text = document.getElementById("strength-text");

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
        { width: "0%", color: "#e0e0e0", label: "" },
        { width: "25%", color: "#ef4444", label: "Weak" },
        { width: "50%", color: "#f97316", label: "Fair" },
        { width: "75%", color: "#eab308", label: "Good" },
        { width: "100%", color: "#22c55e", label: "Strong" },
    ];

    fill.style.width = levels[strength].width;
    fill.style.background = levels[strength].color;
    text.textContent = levels[strength].label;
    text.style.color = levels[strength].color;
}