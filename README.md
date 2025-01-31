PETODO - Task Management API

PETODO is a task management API built with Node.js and Express, using MongoDB as the database. It provides endpoints for managing tasks and users.

Getting Started

Prerequisites

Node.js (v14 or later)

MongoDB (Atlas or Local Instance)

Installation

Clone the repository:

git clone https://github.com/yourusername/petodo.git

Navigate to the project directory:

cd petodo

Install dependencies:

npm install

Configuration

Create a .env file in the root directory with the following content:

NODE_ENV=development
PORT=3000
DATABASE=mongodb+srv://USERNAME:<PASSWORD>@cluster0.idkp4.mongodb.net/TODO?retryWrites=true
DATABASE_PASSWORD=**\***

Replace USERNAME and <PASSWORD> with your actual MongoDB credentials.

Running the Application

Start the development server:

npm start

API Endpoints

Task Routes

Get All Tasks

GET /api/v1/tasks

Get a Single Task

GET /api/v1/tasks/:id

Create a Task

POST /api/v1/tasks
Body:

{
"title": "Task Title",
"description": "Task Description",
"status": "pending"
}

Update a Task

PATCH /api/v1/tasks/:id
Body:

{
"status": "completed"
}

Delete a Task

DELETE /api/v1/tasks/:id

Get Task Statistics

GET /api/v1/tasks/task-stats

Get Tasks for a User

GET /api/v1/tasks/task-for-user/:userName

User Routes

User routes would be defined in userRoutes.js. Document them accordingly based on implementation.

Task Model

The Task model includes the following fields:

title: String (Required, max 50 chars)

description: String

status: Enum [pending, in-progress, completed] (Default: pending)

priority: Enum [low, medium, high] (Default: low)

dueDate: Date

createdAt: Date (Default: now)

updatedAt: Date (Default: now)

assignedTo: Array of User IDs

assignToAll: Boolean (Default: false)

unassignedUsers: Array of User IDs

tags: Array of strings

subtasks: Array of objects with title and status

comments: Array of objects with userId, text, and createdAt

recurrence: Object containing type, interval, and endDate

Example Task Object:

{
"title": "Grocery Shopping",
"description": "Buy weekly groceries including vegetables, fruits, and essentials.",
"status": "pending",
"priority": "high",
"dueDate": "2025-02-05T18:00:00Z",
"createdAt": "2025-01-30T12:00:00Z",
"updatedAt": "2025-01-30T14:00:00Z",
"assignedTo": ["user_id_1"],
"tags": ["shopping", "weekly"],
"subtasks": [
{"title": "Make a shopping list", "status": "pending"},
{"title": "Visit the grocery store", "status": "pending"}
],
"comments": [
{"userId": "user_id_2", "text": "Don't forget to check for discounts!", "createdAt": "2025-01-30T15:00:00Z"}
],
"recurrence": {"type": "weekly", "interval": 1, "endDate": "2025-12-31T23:59:59Z"}
}

Database Seeding

To populate the database with sample data, use the provided script in the data folder.

Import Data

node data/import-dev-data.js --import

Delete Data

node data/import-dev-data.js --delete

License

This project is licensed under the MIT License.
