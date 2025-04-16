# PETODO - Task Management API

![Tests](https://github.com/nvakhovska/peTODO/actions/workflows/test.yml/badge.svg)
![Deploy](https://github.com/nvakhovska/peTODO/actions/workflows/test-and-deploy.yml/badge.svg)

PETODO is a task management API built with Node.js and Express, using MongoDB as the database. It provides endpoints for managing tasks and users.

## 🚀 Getting Started

### 📌 Prerequisites

- Node.js (v14 or later)
- MongoDB (Atlas or Local Instance)

### 📥 Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/petodo.git
   ```
2. Navigate to the project directory:
   ```sh
   cd petodo
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### ⚙️ Configuration

Create a `.env` file in the root directory with the following content:

```ini
NODE_ENV=development
PORT=3000
DATABASE=mongodb+srv://USERNAME:<PASSWORD>@cluster0.idkp4.mongodb.net/TODO?retryWrites=true
DATABASE_PASSWORD=*****
```

Replace `USERNAME` and `<PASSWORD>` with your actual MongoDB credentials.

### ▶️ Running the Application

Start the development server:

```sh
npm start
```

## 📡 API Endpoints

### 📝 Task Routes

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
|        |          |             |

| **GET**    | `/api/v1/tasks`                         | Get all tasks        |
| ---------- | --------------------------------------- | -------------------- |
| **GET**    | `/api/v1/tasks/:id`                     | Get a single task    |
| **POST**   | `/api/v1/tasks`                         | Create a task        |
| **PATCH**  | `/api/v1/tasks/:id`                     | Update a task        |
| **DELETE** | `/api/v1/tasks/:id`                     | Delete a task        |
| **GET**    | `/api/v1/tasks/task-stats`              | Get task statistics  |
| **GET**    | `/api/v1/tasks/task-for-user/:userName` | Get tasks for a user |

### 📌 Example API Request and Response

#### Create a Task

**Request:**

```http
POST /api/v1/tasks
```

**Body:**

```json
{
  "title": "Task Title",
  "description": "Task Description",
  "status": "pending"
}
```

#### Update a Task

**Request:**

```http
PATCH /api/v1/tasks/:id
```

**Body:**

```json
{
  "status": "completed"
}
```

### 🏗 Task Model

The Task model includes the following fields:

| Field             | Type    | Description                                                |
| ----------------- | ------- | ---------------------------------------------------------- |
| `title`           | String  | Required, max 50 chars                                     |
| `description`     | String  | Optional task details                                      |
| `status`          | Enum    | `pending`, `in-progress`, `completed` (Default: `pending`) |
| `priority`        | Enum    | `low`, `medium`, `high` (Default: `low`)                   |
| `dueDate`         | Date    | Task deadline                                              |
| `createdAt`       | Date    | Timestamp (default: now)                                   |
| `updatedAt`       | Date    | Last update timestamp                                      |
| `assignedTo`      | Array   | List of User IDs assigned                                  |
| `assignToAll`     | Boolean | If task is assigned to all users                           |
| `unassignedUsers` | Array   | List of unassigned User IDs                                |
| `tags`            | Array   | List of related tags                                       |
| `subtasks`        | Array   | List of subtasks with `title` and `status`                 |
| `comments`        | Array   | List of comments (`userId`, `text`, `createdAt`)           |
| `recurrence`      | Object  | Recurrence settings (`type`, `interval`, `endDate`)        |

### 📝 Example Task Object:

```json
{
  "title": "Grocery Shopping",
  "description": "Buy weekly groceries including vegetables, fruits, and essentials.",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-02-05T18:00:00.000Z",
  "createdAt": "2025-01-30T12:00:00.000Z",
  "updatedAt": "2025-01-30T14:00:00.000Z",
  "tags": ["shopping", "weekly"],
  "subtasks": [
    { "title": "Make a shopping list", "status": "pending" },
    { "title": "Visit the grocery store", "status": "pending" }
  ],
  "recurrence": {
    "type": "weekly",
    "interval": 1,
    "endDate": "2025-12-31T23:59:59.000Z"
  }
}
```

## 📊 Database Seeding

To populate the database with sample data, use the provided script in the `data` folder.

### 📥 Import tasks into the system and assign users randomly

```sh
node dev-data/import-dev-data.js --import
```

### ❌ Delete all tasks and users from the system

```sh
node dev-data/import-dev-data.js --delete
```

## 📜 License

This project is licensed under the MIT License.

---

Happy coding! 🚀
