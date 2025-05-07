from flask import Flask, jsonify
from flask_cors import CORS
from routes.auth import auth_bp
from config.config import Config
from config.db import Database

def create_app():
    # Initialize Flask app
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app)
    
    # Initialize database connection
    Database.get_instance()
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Basic route for testing
    @app.route('/')
    def index():
        return jsonify({'message': 'Auth Service (Python) is running'})
        
    return app

app = create_app()
