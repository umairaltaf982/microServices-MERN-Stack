#!/bin/bash

# Start Auth Service
echo "Starting Auth Service..."
cd auth-service
npm run dev &
AUTH_PID=$!
cd ..

# Start Book Service
echo "Starting Book Service..."
cd book-service
npm run dev &
BOOK_PID=$!
cd ..

# Start Order Service
echo "Starting Order Service..."
cd order-service
npm run dev &
ORDER_PID=$!
cd ..

# Start React Frontend
echo "Starting React Frontend..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo "All services are running!"
echo "Auth Service: http://localhost:4001"
echo "Book Service: http://localhost:4002"
echo "Order Service: http://localhost:4003"
echo "Frontend: http://localhost:5173"

# Function to handle script termination
function cleanup {
  echo "Stopping all services..."
  kill $AUTH_PID $BOOK_PID $ORDER_PID $CLIENT_PID
  exit
}

# Register the cleanup function for when script receives SIGINT (Ctrl+C)
trap cleanup SIGINT

# Keep script running
echo "Press Ctrl+C to stop all services"
wait
