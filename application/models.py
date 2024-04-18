from flask_sqlalchemy import SQLAlchemy
from flask_security import RoleMixin, UserMixin, AsaList
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.mutable import MutableList

db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model,UserMixin):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(60), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    last_login_at = db.Column(db.DateTime())
    current_login_at = db.Column(db.DateTime())
    last_login_ip = db.Column(db.String(100))
    current_login_ip = db.Column(db.String(100))
    login_count = db.Column(db.Integer)
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    playlists = db.relationship('Playlist', backref='user')
    album = db.relationship('Album', backref='artist')
    songs = db.relationship('Song', backref='artist')


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))



class Genre(db.Model):
    __tablename__ = "genre"
    genre_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    gName = db.Column(db.String(60), nullable=False)
    songs = db.relationship("Song", backref="genre")
    


class Album(db.Model):
    __tablename__ = "album"
    album_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    aName = db.Column(db.String(100), nullable=False)
    album_release = db.Column(db.String(15), nullable=False)
    album_duration = db.Column(db.Float, nullable=False)
    aFlag = db.Column(db.Boolean, default=False)
    artist_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    songs = db.relationship("Song", backref="album", lazy='dynamic')


class Song(db.Model):
    __tablename__ = "song"
    song_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sName = db.Column(db.String(100), nullable=False)
    lyrics = db.Column(db.String, nullable=False)
    image_path = db.Column(db.String(255))
    mp3_path = db.Column(db.String(255))
    sFlag = db.Column(db.Boolean, default=False)
    song_release = db.Column(db.String(15), nullable=False)
    song_duration = db.Column(db.Float, nullable=False)
    artistname = db.Column(db.String(), nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    genre_id = db.Column(db.Integer, db.ForeignKey("genre.genre_id"), nullable=False)
    album_id = db.Column(db.Integer, db.ForeignKey("album.album_id"), nullable=False)
    
    
class SongRating(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    song_id = db.Column(db.Integer, db.ForeignKey("song.song_id"), nullable=True)
    rating = db.Column(db.Integer, default=0)
   
   
class Playlist(db.Model):
    __tablename__ = "playlist"
    playlist_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pName = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(10), nullable=False)
    tracks = db.Column(db.Integer, nullable=False) 
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    songs = relationship("Song", secondary="playlist_song_association", backref="playlists")
    
class PlaylistSongAssociation(db.Model):
    __tablename__ = "playlist_song_association"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey("playlist.playlist_id"), nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey("song.song_id"), nullable=False)
    
    

