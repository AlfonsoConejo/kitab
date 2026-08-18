# Kitab

This project is the frontend for Kitab, a full-stack web platform currently in development that helps students organize and manage their academic activities, including periods, courses, and tasks.

Backend API: https://github.com/AlfonsoConejo/kitab-api

## Live Demo

https://kitab-six.vercel.app

## Tech Stack

- **Frontend:** React, Context API, Tailwind CSS.
- **Backend:** Node.js, Express.js (REST architecture).
- **Database:** PostgreSQL (Hosted on Neon DB).
- **Security:** JWT, Bcrypt.

## Security Features & Architecture

- **Secure Authentication:** Login flow using JWT and protection of sensitive data on the front end.
- **Resource-Level Authorization:** Express middleware that validates the `user_id` before allowing CRUD operations, preventing ID manipulation between users.
- **Referential Integrity:** Robust relational database with logical/cascading delete to protect business logic.

## Architecture Overview

- React frontend with Context API for state management
- REST API built with Node.js and Express
- PostgreSQL database with relational schema hosted on Neon
- JWT-based authentication with access/refresh tokens
- Strict user-based authorization at API level

## Screenshots

<table>
  <tr>
    <th>Landing Page</th>
    <th>Periods Page</th>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/dd219f24-3633-47e4-b967-0fd517f97f93" alt="Landing">
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/2eff9252-dd67-4479-9b13-2333e441d592" alt="Periods">
    </td>
  </tr>
  <tr>
    <th>Subjects Page</th>
    <th>Subject View</th>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/ec33362f-a4b0-4f8a-8ea1-291e8337a0b4" alt="Subjects">
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/9bde0f2a-19d9-4434-b8ab-aa702186dc22" alt="Subject View">
    </td>
  </tr>
</table>

## Features

### Features

### Implemented

- **Authentication system**<br>
  Secure login and session management using JWT.

- **Academic period management (CRUD)**<br>
  Create, read, update, and delete academic periods with secure user-based access control.

- **Subject and class management (CRUD)**<br>
  Create, read, update, and delete subjects and their associated classes through a nested form.

- **Schedule conflict detection**<br>
  Automatic detection of scheduling conflicts between classes, including conflicts across different subjects.

### In development

- Vacation and leave management system
- Task tracking system per subjects
- Daily dashboard overview
- Interactive class calendar
- Multi-device session control

## Getting Started

### 1. Clone repositories

Clone the frontend repository:
```bash
git clone https://github.com/AlfonsoConejo/kitab.git
```

Clone the backend repository:
```bash
git clone https://github.com/AlfonsoConejo/kitab-api.git
```

### 2. Backend setup

Enter the backend folder:
```bash
cd kitab-api
```

Install dependencies:
```bash
npm install
```

Create a .env file:
```bash
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
FRONTEND_URL=
NODE_ENV=
```

Run the backend (default port: 3000):
```bash
npm run dev
```

### 3. Frontend setup

Open a new terminal and enter the frontend folder:
```bash
cd kitab
```

Install dependencies:
```bash
npm install
```

Create a .env file:
```bash
VITE_API_URL=http://localhost:3000
```

Run the frontend (terminal 2):
```bash
npm run dev
```

### 4. Application flow

- Backend runs on: http://localhost:3000
- Frontend runs on: http://localhost:5173 (default Vite port)
- Make sure both servers are running simultaneously
