# run.py
from app import create_app
from config import Config

app = create_app()

if __name__ == '__main__':
    print(f"\n🌐 Server starting on http://{Config.HOST}:{Config.PORT}")
    print(f"📚 API Documentation: http://localhost:{Config.PORT}/")
    print(f"🏥 Health Check: http://localhost:{Config.PORT}/health")
    print(f"\nPress CTRL+C to stop\n")
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )