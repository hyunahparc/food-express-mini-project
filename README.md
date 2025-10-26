# FoodExpress API

## Overview
FoodExpress is a RESTful API for an online food ordering service. It provides user management, restaurant management, and menu management with role-based access control (admin vs. regular users).

---

## Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB + Mongoose  
- **Authentication:** JWT, Passport.js  
- **Documentation:** Swagger (OpenAPI)  
- **Testing:** Jest, Supertest 

The project was built using Node.js and Express.js as the main stack.
MongoDB was used as the database along with Mongoose for schema-based modeling.
JWT tokens were implemented for user authentication, and Passport.js was used for login management to enable future social login integration.
Testing was performed using Jest, and Swagger was used to simplify API documentation and testing.

---

## Features
### User
- Register a new user
- Login to get JWT token
- Update own user information (authenticated)
- Delete own account (authenticated)
- Admin-only:
  - Get all users
  - Update a user
  - Delete a user

### Restaurant
- Get all restaurants (public, pagination & sorting)
- Admin-only:
  - Create a restaurant
  - Update a restaurant
  - Delete a restaurant

### Menu
- Get all menus (public, pagination & sorting)
- Admin-only:
  - Create a menu
  - Update a menu
  - Delete a menu

---

## Installation

1. You can either:
Clone the repository:
```bash
git clone https://github.com/hyunahparc/food-express-mini-project.git
cd food-express-mini-project
```
Or use the provided project files directly.

2. Install dependencies:
```bash
npm install
```
3. Configure environment variables:
Create a .env file in the root directory:
```env
DB_URL = mongodb://localhost:27017
JWT_SECRET = <your_jwt_secret>
```
Note: The actual `.env` file is **included only in the submission archive**.

---

## Running the Application
```bash
npm run dev
```
Server will run at: http://localhost:8080

---

## API Documentation
You can view and test all API endpoints via Swagger UI at:  
**http://localhost:8080/api-docs**

---

## Testing
Tests are written using Jest and Supertest. Only critical functionalities are covered (user, restaurant, menu).

Run tests:
```bash
npm test
```
Note: Test data created during Jest tests are automatically cleaned up using afterAll hooks to ensure the database remains clean.

---

## Available Scripts
- `npm run dev` — start development server (with nodemon)
- `npm test` — run Jest tests

---

## Folder Structure
project-root/
├─ config/
├─ controllers/
├─ middlewares/
├─ models/
├─ routes/
├─ tests/
├─ validations/
├─ .env
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ README.md
├─ server.js
└─ swagger.yaml
