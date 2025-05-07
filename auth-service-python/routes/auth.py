from flask import Blueprint, request, jsonify
import jwt
from datetime import datetime, timedelta
from models.user import User
from middleware.auth import auth_middleware
from config.config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        # Validate input
        if not all([name, email, password]):
            return jsonify({'message': 'Please provide name, email, and password'}), 400
            
        # Check if user already exists
        existing_user = User.find_by_email(email)
        if existing_user:
            return jsonify({'message': 'User already exists'}), 400
            
        # Create new user
        user = User(name=name, email=email, password=password)
        user.save()
        
        # Create JWT payload
        payload = {
            'user': {
                'id': str(user._id),
                'role': user.role
            },
            'exp': datetime.utcnow() + timedelta(seconds=Config.JWT_EXPIRATION)
        }
        
        # Sign token
        token = jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')
        
        return jsonify({'token': token}), 201
        
    except Exception as e:
        print(f"Register error: {str(e)}")
        return jsonify({'message': 'Server error'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        print(f"Login attempt: {email}")
        
        # Validate input
        if not all([email, password]):
            return jsonify({'message': 'Please provide email and password'}), 400
            
        # Check if user exists
        user = User.find_by_email(email)
        print(f"User found: {'Yes' if user else 'No'}")
        
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 400
            
        # Check password
        print("Comparing password...")
        is_match = user.compare_password(password)
        print(f"Password match: {'Yes' if is_match else 'No'}")
        
        if not is_match:
            return jsonify({'message': 'Invalid credentials'}), 400
            
        # Create JWT payload
        payload = {
            'user': {
                'id': str(user._id),
                'role': user.role
            },
            'exp': datetime.utcnow() + timedelta(seconds=Config.JWT_EXPIRATION)
        }
        
        # Sign token
        token = jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')
        
        return jsonify({'token': token}), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': 'Server error'}), 500

@auth_bp.route('/me', methods=['GET'])
@auth_middleware
def get_current_user():
    try:
        user = User.find_by_id(request.user['id'])
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        # Return user data without password
        user_data = user.to_dict(exclude_password=True)
        user_data['_id'] = str(user_data['_id'])  # Convert ObjectId to string
        
        return jsonify(user_data), 200
        
    except Exception as e:
        print(f"Get current user error: {str(e)}")
        return jsonify({'message': 'Server error'}), 500
