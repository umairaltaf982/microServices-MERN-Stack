#!/bin/bash

# Script to switch between JavaScript and Python auth service implementations

function start_js_auth_service() {
  echo "Starting JavaScript Auth Service..."
  cd auth-service
  npm run dev
}

function start_python_auth_service() {
  echo "Starting Python Auth Service..."
  cd auth-service-python
  python index.py
}

echo "=== Auth Service Switcher ==="
echo "1. Start JavaScript Auth Service"
echo "2. Start Python Auth Service"
echo "3. Exit"
echo "=========================="
read -p "Enter your choice (1-3): " choice

case $choice in
  1)
    start_js_auth_service
    ;;
  2)
    start_python_auth_service
    ;;
  3)
    echo "Exiting..."
    exit 0
    ;;
  *)
    echo "Invalid choice. Exiting..."
    exit 1
    ;;
esac
