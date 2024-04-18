from main import app
from application.sec import datastore
from application.models import db,Role
from flask_security import hash_password
from werkzeug.security import generate_password_hash
import bcrypt

with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="User is an admin")
    datastore.find_or_create_role(name="artist", description="User is an Artist")
    datastore.find_or_create_role(name="user", description="User is a user")
    db.session.commit()       
    if not datastore.find_user(email="admin@email.com"):
        password = "admin"
        admin_user=datastore.create_user(
            email="admin@email.com",
            username="admin", 
            password=bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()))
            # roles=["admin"])
        datastore.add_role_to_user(admin_user, 'admin')
    if not datastore.find_user(email="artist1@email.com"):
        password = "artist"
        artist_user=datastore.create_user(
            email="artist1@email.com",
            username="artist1",
            password=bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()),
            # roles=["artist"],
            # active=False
            )
        datastore.add_role_to_user(artist_user, 'artist')
        
    if not datastore.find_user(email="user@email.com"):
        password = "user"
        end_user=datastore.create_user(
            email="user@email.com",
            username="user1",
            password=bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()),
            # roles=["user"]
            )
        datastore.add_role_to_user(end_user, 'user')
    if not datastore.find_user(email="imran@email.com"):
        password = "12345678"
        end_user1 = datastore.create_user(
            email="imran@email.com",
            username="imran",
            password=bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()), 
            # roles=["user"]
            )
        datastore.add_role_to_user(end_user1, 'user')
    
    db.session.commit()
    