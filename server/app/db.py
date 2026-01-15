"""
MongoDB Connection Setup
"""
from pymongo import MongoClient
from flask import current_app, g


def get_db():
    """Get the MongoDB database instance."""
    if 'db' not in g:
        client = MongoClient(current_app.config['MONGO_URI'])
        g.db = client[current_app.config['MONGO_DB_NAME']]
    return g.db


def init_db(app):
    """Initialize database connection and setup."""
    with app.app_context():
        db = get_db()
        # Ensure overlays collection exists
        if 'overlays' not in db.list_collection_names():
            db.create_collection('overlays')
    
    @app.teardown_appcontext
    def close_db(exception):
        """Close database connection when app context ends."""
        db = g.pop('db', None)
        if db is not None:
            db.client.close()
