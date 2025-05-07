from models.user import User
from config.db import Database

# Sample user data
users = [
    {
        'name': 'Admin User',
        'email': 'admin@example.com',
        'password': 'admin123',
        'role': 'admin'
    },
    {
        'name': 'Regular User',
        'email': 'user@example.com',
        'password': 'user123',
        'role': 'user'
    }
]

def seed_database():
    try:
        # Initialize database connection
        db = Database.get_instance().get_db()
        
        # Delete existing users
        db.users.delete_many({})
        print('Deleted existing users')
        
        # Create users
        for user_data in users:
            user = User(
                name=user_data['name'],
                email=user_data['email'],
                password=user_data['password'],
                role=user_data['role']
            )
            user.save()
            print(f"Added user: {user.email}")
        
        print('\nDatabase seeding completed successfully')
        print('\nYou can now log in with these credentials:')
        print('Admin: admin@example.com / admin123')
        print('User: user@example.com / user123')
        
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
    finally:
        # Close database connection
        Database.get_instance().close()

if __name__ == '__main__':
    seed_database()
