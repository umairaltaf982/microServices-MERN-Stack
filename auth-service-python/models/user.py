import bcrypt
from datetime import datetime
from bson import ObjectId
from config.db import Database

class User:
    collection_name = 'users'

    def __init__(self, name, email, password, role='user', _id=None, created_at=None):
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self._id = _id
        self.created_at = created_at or datetime.now()

    @classmethod
    def get_collection(cls):
        db = Database.get_instance().get_db()
        return db[cls.collection_name]

    @classmethod
    def find_by_email(cls, email):
        user_data = cls.get_collection().find_one({'email': email.lower()})
        if user_data:
            return cls.from_dict(user_data)
        return None

    @classmethod
    def find_by_id(cls, user_id):
        try:
            user_data = cls.get_collection().find_one({'_id': ObjectId(user_id)})
            if user_data:
                return cls.from_dict(user_data)
        except Exception as e:
            print(f"Error finding user by ID: {str(e)}")
        return None

    @classmethod
    def from_dict(cls, user_dict):
        return cls(
            name=user_dict.get('name'),
            email=user_dict.get('email'),
            password=user_dict.get('password'),
            role=user_dict.get('role', 'user'),
            _id=user_dict.get('_id'),
            created_at=user_dict.get('created_at')
        )

    def to_dict(self, exclude_password=False):
        user_dict = {
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at
        }
        
        if not exclude_password:
            user_dict['password'] = self.password
            
        if self._id:
            user_dict['_id'] = self._id
            
        return user_dict

    def save(self):
        if not self.password.startswith('$2b$'):  # Check if password is already hashed
            self.password = self._hash_password(self.password)
            
        user_data = self.to_dict()
        
        if self._id:  # Update existing user
            self.get_collection().update_one(
                {'_id': self._id},
                {'$set': user_data}
            )
        else:  # Insert new user
            result = self.get_collection().insert_one(user_data)
            self._id = result.inserted_id
            
        return self

    def compare_password(self, candidate_password):
        try:
            print(f"Comparing passwords for {self.email}")
            return bcrypt.checkpw(
                candidate_password.encode('utf-8'),
                self.password.encode('utf-8')
            )
        except Exception as e:
            print(f"Error comparing passwords: {str(e)}")
            return False

    def _hash_password(self, password):
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
