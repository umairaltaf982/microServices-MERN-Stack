import jwt
from functools import wraps
from flask import request, jsonify
from config.config import Config
from models.user import User

def auth_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get token from header
        token = request.headers.get('x-auth-token')
        
        # Check if no token
        if not token:
            return jsonify({'message': 'No token, authorization denied'}), 401
        
        # Verify token
        try:
            # Decode token
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
            user_id = payload['user']['id']
            
            # Get user from database
            user = User.find_by_id(user_id)
            if not user:
                return jsonify({'message': 'User not found'}), 401
                
            # Add user to request
            request.user = {
                'id': str(user._id),
                'role': user.role
            }
            
            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is not valid'}), 401
        except Exception as e:
            print(f"Auth middleware error: {str(e)}")
            return jsonify({'message': 'Server error'}), 500
            
    return decorated_function
