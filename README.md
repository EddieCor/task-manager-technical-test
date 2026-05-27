# Task Manager Technical Test

A simple full-stack To-Do List application built for a technical test.

The application allows users to:

- View all existing tasks.
- Create a new task with the initial status `NEW`.
- Mark a task as `STARTED` or `COMPLETED`.
- Assign a task to a person.
- Delete a task.
- Prevent completing a task if no person is assigned.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- SQLite

## Project Structure

```txt
TechnicalTest/
  backend/
    prisma/
      migrations/
      schema.prisma
      seed.ts
    sql/
      people-dml.sql
    src/
      lib/
        prisma.ts
      routes/
        people.routes.ts
        tasks.routes.ts
      server.ts
  frontend/
    src/
      services/
        api.ts
      types/
        person.ts
        task.ts
      App.tsx
      App.css
  README.md
```

## Requirements

Make sure you have the following installed:

- Node.js
- npm
- Git

This project was developed using Node.js `v24.16.0` and npm `11.13.0`.

## Backend Setup

From the project root, go into the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

````md
Create a local environment file:

```bash
copy .env.example .env
````

On macOS/Linux:

```bash
cp .env.example .env
```

Create the SQLite database and apply Prisma migrations:

```bash
npx prisma migrate dev
```

Seed the database with initial people:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

The backend will run at:

```txt
http://localhost:3000
```

## Frontend Setup

Open a second terminal.

From the project root, go into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run at:

```txt
http://localhost:5173
```

## API Endpoints

### People

```txt
GET /api/people
```

Returns all people.

### Tasks

```txt
GET /api/tasks
```

Returns all tasks, including assigned person data.

```txt
POST /api/tasks
```

Creates a new task.

Example body:

```json
{
  "title": "Create homepage",
  "description": "Build the first version of the homepage"
}
```

The task is created with:

```txt
status: NEW
completed: false
```

```txt
PUT /api/tasks/:id
```

Updates task data, status, or assigned person.

Example body for assigning a person:

```json
{
  "assignedPersonId": 1
}
```

Example body for updating status:

```json
{
  "status": "STARTED"
}
```

A task cannot be marked as `COMPLETED` unless it has an assigned person.

```txt
DELETE /api/tasks/:id
```

Deletes a task by ID.

## Task Status Flow

Tasks support the following statuses:

```txt
NEW
STARTED
COMPLETED
```

When a task is marked as `STARTED`, the backend sets `startedAt`.

When a task is marked as `COMPLETED`, the backend sets `completedAt` and marks `completed` as `true`.

If a task is reset to `NEW`, the backend clears `startedAt`, `completedAt`, and sets `completed` to `false`.

## People DML Script

The file below contains SQL DML examples for the `Person` table:

```txt
backend/sql/people-dml.sql
```

It includes examples for:

- `INSERT`
- `SELECT`
- `UPDATE`
- `DELETE`

## Notes

- The project uses SQLite for a simple local setup.
- The database file is ignored by Git and can be recreated using Prisma migrations.
- The frontend communicates with the backend at `http://localhost:3000/api`.
- The UI updates task creation, assignment, status changes, and deletion without requiring a page reload.
