from pymongo import MongoClient
from config.config import Config

class Database:
    _instance = None
    _client = None
    _db = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = Database()
        return cls._instance

    def __init__(self):
        if Database._client is None:
            try:
                Database._client = MongoClient(Config.MONGODB_URI)
                # Extract database name from connection string
                db_name = Config.MONGODB_URI.split('/')[-1]
                Database._db = Database._client[db_name]
                print("MongoDB connected successfully")
            except Exception as e:
                print(f"MongoDB connection error: {str(e)}")
                raise e

    def get_db(self):
        return Database._db

    def close(self):
        if Database._client:
            Database._client.close()
            print("MongoDB connection closed")
