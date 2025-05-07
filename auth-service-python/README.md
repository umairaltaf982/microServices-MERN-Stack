# Auth Service (Python)

This is a Python implementation of the authentication service for the Online Book Store microservices project.

## Features

- User registration and login
- JWT-based authentication
- Role-based authorization (user/admin)
- MongoDB integration

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=4001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=3600
   ```

3. Seed the database with sample users:
   ```
   python seed.py
   ```

4. Run the service:
   ```
   python index.py
   ```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user information (requires authentication)

## Sample Users

After running the seed script, you can use these credentials:

- Admin: admin@example.com / admin123
- User: user@example.com / user123
