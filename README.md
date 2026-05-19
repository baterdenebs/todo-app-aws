# ✅ Todo List App on AWS

A full-stack todo app built on AWS as part of my SAA exam prep.

## 🏗️ Architecture
Browser (S3) → API Gateway → Lambda (Python) → DynamoDB
                                                    ↑
                                              Cognito (auth)
                                              CloudFront (CDN)

## 🛠️ AWS Services Used
- S3 — static frontend hosting
- API Gateway — REST API
- Lambda — Python backend
- DynamoDB — database
- Cognito — user authentication
- CloudFront — CDN

## 📅 Progress
- [x] Week 1 - S3 static hosting
- [x] Week 2 Day 1 - First Lambda function
- [ ] Week 2 - API Gateway
- [ ] Week 3 - DynamoDB
- [ ] Week 4 - IAM + Security
- [ ] Week 5 - Cognito Auth
- [ ] Week 6 - CloudFront

## 🔗 Live URL
http://todo-app-yourname.s3-website.ap-northeast-2.amazonaws.com