from app.app import app
from config.config import Config

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config.PORT, debug=True)
