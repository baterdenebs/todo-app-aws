# ✅ TodoApp

A full-stack serverless todo application built on AWS, featuring user authentication, real-time data persistence, and global content delivery.

## 🌐 Live Demo
https://d38lg59locxq6.cloudfront.net

## 🏗️ Architecture
Browser → CloudFront → S3 (Frontend)
Browser → CloudFront → API Gateway → Lambda → DynamoDB
↑
Cognito (Auth)
## ✨ Features
- User signup, login and email verification
- Each user sees only their own todos
- Add and delete todos in real time
- Data persists forever in the cloud
- Secure JWT authentication
- HTTPS everywhere
- Fast global content delivery

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Hosting | AWS S3 + CloudFront |
| Auth | AWS Cognito |
| API | AWS API Gateway |
| Backend | AWS Lambda (Python) |
| Database | AWS DynamoDB |
| Security | AWS IAM |

## 🔐 Security
- JWT tokens required for all API requests
- Least privilege IAM policies
- User data isolated by unique user ID
- S3 bucket private — accessible only via CloudFront
- CORS configured on API Gateway
