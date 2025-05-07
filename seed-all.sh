#!/bin/bash

echo "Seeding Auth Service database..."
cd auth-service
npm run seed
cd ..

echo "Seeding Book Service database..."
cd book-service
npm run seed
cd ..

echo "Seeding Order Service database..."
cd order-service
npm run seed
cd ..

echo "All databases have been seeded successfully!"
echo "You can now run the application with ./start-services.sh"
