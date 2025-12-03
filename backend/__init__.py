import os

from dotenv import load_dotenv
from flask import Flask
from .api.routes import *
from .auth.auth import *
from flask_cors import CORS
def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    load_dotenv()
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'inventory.sqlite'),
    )
    CORS(app,supports_credentials=True, origins=["http://localhost:3000"],resources={r"/*": {"origins": "http://localhost:3000"}})
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    from .db import db
    db.init_app(app)
    # Registering blueprints
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(auth_bp)
    return app