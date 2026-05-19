// Temporary local storage (will connect to AWS later)
let todos = [];

function addTodo() {
  const input = document.getElementById("todoInput");
  const text = input.value.trim();

  if (text === "") return;

  const todo = {
    id: Date.now().toString(),
    text: text
  };

  todos.push(todo);
  input.value = "";
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  renderTodos();
}

function renderTodos() {
  const list = document.getElementById("todoList");
  list.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${todo.text}</span>
      <button class="delete-btn" onclick="deleteTodo('${todo.id}')">Delete</button>
    `;
    list.appendChild(li);
  });
}