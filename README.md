# Online Bookstore Microservices

A microservices-based online bookstore application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Architecture Overview

This project demonstrates a microservices architecture with the following services:

- **Auth Service**: Handles user registration and authentication
- **Book Service**: Manages book listings (CRUD operations)
- **Order Service**: Handles order placement and management
- **Frontend**: React application that communicates with all services

Each service has its own:
- Express.js server
- MongoDB database
- Business logic and API endpoints

## Services and Endpoints

### Auth Service (Port 4001)
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login and get JWT token

### Book Service (Port 4002)
- GET `/api/books` - Get all books
- GET `/api/books/:id` - Get a specific book
- POST `/api/books` - Add a new book
- PUT `/api/books/:id` - Update a book
- DELETE `/api/books/:id` - Delete a book

### Order Service (Port 4003)
- GET `/api/orders` - Get all orders for a user
- GET `/api/orders/:id` - Get a specific order
- POST `/api/orders` - Create a new order
- PUT `/api/orders/:id` - Update an order status

## Setup and Running

### Prerequisites
- Node.js and npm
- MongoDB

### Installation and Setup

1. Clone the repository
```
git clone <repository-url>
cd bookstore-microservices
```

2. Install dependencies for each service
```
cd auth-service && npm install
cd ../book-service && npm install
cd ../order-service && npm install
cd ../client && npm install
```

3. Set up environment variables
Create a `.env` file in each service directory with the following variables:
```
PORT=400x
MONGODB_URI=mongodb://localhost:27017/service-name
JWT_SECRET=your_jwt_secret
```

4. Start each service
```
cd auth-service && npm start
cd ../book-service && npm start
cd ../order-service && npm start
cd ../client && npm start
```

5. Access the application
- Frontend: http://localhost:3000
- Auth Service: http://localhost:4001
- Book Service: http://localhost:4002
- Order Service: http://localhost:4003

## Technologies Used
- MongoDB: Database for each service
- Express.js: REST API backend for each service
- React.js: Frontend UI
- Node.js: Server environment
- JWT: Authentication
- Axios: For API calls from React
# microServices-MERN-Stack
