# Product Management CRUD Application

A full-stack product management application built with Next.js, NestJS, TypeScript, and PostgreSQL.

## Technologies Used

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript, REST API
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Validation:** class-validator, class-transformer

## Features

- Create products
- View all products
- View product details through the API
- Update existing products
- Delete products
- Validate product names and prices
- Display success and error messages
- Loading state while saving
- Store product data in PostgreSQL

## API Endpoints

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| POST   | `/products`     | Create a product    |
| GET    | `/products`     | Get all products    |
| GET    | `/products/:id` | Get a product by ID |
| PATCH  | `/products/:id` | Update a product    |
| DELETE | `/products/:id` | Delete a product    |

## Running the Project

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend URL: `http://localhost:3000`

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:3001` (or the port shown in your terminal).

## Database Setup

Install PostgreSQL and create a database named `crud_db`.

Configure the database connection in `backend/src/app.module.ts` with your PostgreSQL credentials before starting the backend.

## Author

Developed as a full-stack CRUD assignment.
