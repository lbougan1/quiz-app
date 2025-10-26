# Quiz App

A simple quiz application built with a Node.js backend and a React frontend. This guide explains how to set up and run the app locally.

---

## Prerequisites
Before running the app, ensure you have the following installed:
- [Docker](https://www.docker.com/) (for MongoDB)
- [Node.js](https://nodejs.org/) and npm
- [Yarn](https://yarnpkg.com/)

---

## Steps to Run the App Locally

### 1. Running MongoDB
Start a MongoDB container using Docker:
```bash
docker run --name mongodb -d -p 27017:27017 mongo:latest
```
Running the backend : 
```bash
cd backend
node app.js
```

#### Importing actual Data. You must create a csv file containing actual question/answer data.
```bash
node importData.js ~/telegram_data/quiz.csv
```

Running the frontend:
```bash
cd quiz-app
npm start
```
