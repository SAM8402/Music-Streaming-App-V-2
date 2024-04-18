from flask_restful import Resource, Api, reqparse, fields, marshal,marshal_with
from flask import request, jsonify,current_app as app
from flask_security import current_user,auth_required,roles_accepted,auth_token_required
from sqlalchemy import or_
from application.models import db,Album,Song,Genre,Playlist,SongRating,PlaylistSongAssociation
import os,json
from .instances import cache



api = Api(prefix="/api")


genre_fields = {
    "genre_id": fields.Integer,
    "gName": fields.String,
}


album_fields ={
    "album_id":fields.Integer,
    "aName":fields.String,
    "album_release":fields.String,
    "album_duration": fields.Float,
    "aFlag":fields.Boolean,
}

song_fields ={
    "song_id": fields.Integer,
    "sName": fields.String,
    "albumname": fields.String(attribute="album.aName"),
    "playlistName": fields.String(attribute=lambda x: x.playlists[0].pName if x.playlists else None),
    "genrename": fields.String(attribute="genre.gName"),
    "albumid": fields.String(attribute="album.album_id"),
    "playlistid": fields.String(attribute=lambda x: x.playlists[0].playlist_id if x.playlists else None),
    "genreid": fields.String(attribute="genre.genre_id"),
    "image_path": fields.String,
    "rating": fields.Integer(attribute=lambda x: SongRating.query.filter_by(song_id=x.song_id).first().rating if SongRating.query.filter_by(song_id=x.song_id).first() else None),
    "sFlag": fields.Boolean,
    "song_release": fields.String,
    "song_duration": fields.String,
    "artistname": fields.String,
}

song = {
    "playlistid": fields.Integer(attribute=lambda x: x.playlist_id),
    "song_id": fields.Integer,
    "sName": fields.String,
    "sFlag": fields.Boolean,
    "artistname": fields.String,
}




class AllGenreApi(Resource):
    @auth_required("token")
    @cache.cached(timeout=10)
    def get(self): #? here all genre are get
        genre = Genre.query.all()
        if genre is not None:
            return marshal(genre,genre_fields)
        else:
            return jsonify({"message": "Genre not found"})
    
api.add_resource(AllGenreApi, "/all_genre")      
 

class AllAlbumApi(Resource):
    @auth_required("token")
    @cache.cached(timeout=10)
    def get(self): #? here all album are get
        albums = Album.query.all()
        if albums is not None:
            return marshal(albums,album_fields)
        else:
            return jsonify({"message": "Albums not found"})
    @auth_required("token")
    def put(self,album_id): #? here album are flag
        album = Album.query.get(album_id)
        if album:
            if(album.aFlag):
                album.aFlag = False
                db.session.commit()
                cache.clear()
                return jsonify({"message":"Album Unflagged successfully"})
            else:
                album.aFlag = True
                db.session.commit()
                cache.clear()
                return jsonify({"message":"Album Flagged Successfully"})
        else:
            return jsonify({"message":"Album not found"})
        
api.add_resource(AllAlbumApi, "/all_album","/flag_album/<int:album_id>") 

class AlbumApi(Resource):
    @auth_required("token")
    @roles_accepted('artist')
    @cache.cached(timeout=10)
    def get(self): #? here all album are get that belong to a artist_id
        albums = Album.query.filter_by(artist_id=current_user.id).all()
        if albums is not None:
            return marshal(albums,album_fields)
        else:
            return jsonify({"message" : "Album not found"})
        
    @auth_required("token")
    @roles_accepted('artist')
    def put(self,album_id): #? here album is updating
        album_data = request.get_json()
        album = Album.query.get(album_id)
        if album:
            if album_data.get("name"):
                album.aName = album_data.get("name")
            db.session.commit()
            # cache.clear()
            return jsonify({"message":"Album updated successfully"})
        else:
            return jsonify({"message":"Album not found"})
        
    @auth_required("token")
    @roles_accepted('artist', 'admin')
    def delete(self, album_id):
        this_album = Album.query.get(album_id)
        if this_album is not None:
            try:
                song = Song.query.filter_by(album_id=album_id).all()
                for s in song:
                    audio_path = os.path.join(app.config["UPLOAD_FOLDER"], os.path.basename(s.mp3_path))
                    image_path = os.path.join(app.config["IMAGE_FOLDER"], os.path.basename(s.image_path))
                    if os.path.exists(audio_path):
                        os.remove(audio_path)
                    if os.path.exists(image_path):
                        os.remove(image_path)
                # Delete all songs associated with the album
                Song.query.filter_by(album_id=album_id).delete()
                # Commit the deletion of songs first
                db.session.commit()
                
                # Now delete the album
                db.session.delete(this_album)
                db.session.commit()
                cache.clear()
                return jsonify({"message": "Successfully Deleted"})
            except Exception as e:
                db.session.rollback()
                return jsonify({"message": str(e)}), 500
        else:
            return jsonify({"message": "Album not found"})


api.add_resource(AlbumApi, "/album","/update/album/<int:album_id>","/delete/album/<int:album_id>")

class AllSongApi(Resource):
    @auth_required("token")
    @cache.cached(timeout=10)
    def get(self):  
        song = Song.query.all()
        if song is not None:
            return marshal(song,song_fields)
        else:
            return jsonify({"message": "Song not found"})
        
    @auth_required("token")
    def put(self,song_id): #? here album are flag
        song = Song.query.get(song_id)
        if song:
            if(song.sFlag):
                song.sFlag = False
                db.session.commit()
                # cache.clear()
                return jsonify({"message": "UnReported this song successfully"})
            else:
                song.sFlag = True
                db.session.commit()
                # cache.clear()
                return jsonify({"message": "Reported this song successfully"})
        else:
            return jsonify({"message":"Song not found"})
    
api.add_resource(AllSongApi, "/all_song","/flag_song/<int:song_id>") 

class SongApi(Resource):
    @auth_required("token")
    @roles_accepted('artist', 'admin')
    @cache.cached(timeout=10)
    def get(self):#? here all song are get that belong to a artist_id
        print("song1")
        artistId = current_user.id
        print(current_user.id)
        songs = Song.query.filter_by(artist_id=artistId).all()
        print("songs")
        if songs:
            return marshal(songs,song_fields)
        else:
            return jsonify({"message":"Song not found"})
    
    @auth_required("token")
    @roles_accepted("artist")
    def put(self,song_id):
        song_data = request.get_json()
        song = Song.query.get(song_id)
        print(song_data)
        if song_data:
            print(song_data)
            
            # Get the genre object associated with the song
            # Handle the form submission here
            title = song_data.get("title")
            singer = song_data.get("artistname")
            date = song_data.get("song_release")
            duration = abs(float(song_data.get("song_duration")))
            oldDuration = song.song_duration
            lyrics = song_data.get("lyrics")
            album_title = song_data.get("aName")
            genre_name = song_data.get("gName")

            # Update the song details
            if song:
                if title:
                    song.sName = title
                if lyrics:
                    song.lyrics = lyrics
                if singer:
                    song.artistname = singer
                if date:
                    song.song_release = date
                if duration:
                    song.song_duration = duration
                db.session.commit()
            
                genre = Genre.query.get(song.genre_id)
                if genre:
                    if genre_name:
                        genre.gName = genre_name
                        db.session.commit()

                album = Album.query.get(song.album_id)
                if album:
                    if album_title:
                        album.aName = album_title
                        album.album_duration -= oldDuration 
                        album.album_duration += duration 
                        db.session.commit()
                # cache.clear()        
                return jsonify({"message":"Song updated successfully"})
            else:
                return jsonify({"message":"Song not found"}) 



          
    @auth_required("token")
    @roles_accepted('artist', 'admin')
    def delete(self, song_id):
        song = Song.query.get(song_id)

        if song:
            SongRating.query.filter_by(song_id=song_id).delete()
            # Find and update the playlists containing the song
            playlists = Playlist.query.join(PlaylistSongAssociation).filter(PlaylistSongAssociation.song_id == song_id).all()
            for playlist in playlists:
                # Remove the song from the playlist
                playlist_song_association = PlaylistSongAssociation.query.filter_by(playlist_id=playlist.playlist_id, song_id=song_id).first()
                db.session.delete(playlist_song_association)
                playlist.tracks -= 1

            try:
                # Delete the song file from the local device
                audio_path = os.path.join(app.config["UPLOAD_FOLDER"], os.path.basename(song.mp3_path))
                image_path = os.path.join(app.config["IMAGE_FOLDER"], os.path.basename(song.image_path))

                if os.path.exists(audio_path):
                    os.remove(audio_path)
                if os.path.exists(image_path):
                    os.remove(image_path)

                # Delete the song from all related tables
                album = Album.query.filter_by(album_id=song.album_id).first()
                if album:
                    tDuration = album.album_duration - song.song_duration  # Update the total duration of the existing album
                    album.album_duration = tDuration

                db.session.delete(song)
                db.session.commit()
                cache.clear()
                return jsonify({"message": "Song deleted successfully"})
            except Exception as e:
                return jsonify({"message": f"Error deleting song: {str(e)}"}), 500
        else:
            return jsonify({"message": "Song not found"}), 404


    @auth_required("token")
    @roles_accepted("artist")
    def post(self):
        try:
            print("Inside post method")
            print(current_user.id)
            # print(request.headers)
            data = json.loads(request.form['data'])
            print(data.get('sName'))
            audio_file = request.files.get('audio_file',None)
            image_file = request.files.get('image_file',None)
            print(data,audio_file,image_file)
            if data:
                title = data.get('sName','').strip()
                print('title')
                duration = abs(float(data.get('song_duration','').strip()))
                singer = data.get('singer','').strip()
                date = data.get('song_release','').strip()
                lyrics = data.get('lyrics','').strip()
                album_title = data.get('aName','').strip()
                genre_name = data.get('gName','').strip()
                print('genre_name')
                print(title, duration, singer, date, lyrics, album_title, genre_name)
            else:
                return jsonify({"message": "No data is coming "})
            
            
            
            print("data is here")
            song= Song.query.filter_by(sName=title,artist_id=current_user.id).first()
            print(song)
            if song:
                print("song")
                return jsonify({"message":"Song is  already exist"})
            else:
                # Check if the selected genre and album exist, if not, add them
                genre = Genre.query.filter_by(gName=genre_name).first()
                print(genre)
                if not genre:
                    genre = Genre(gName=genre_name)
                    db.session.add(genre)

                album = Album.query.filter_by(aName=album_title,artist_id=current_user.id).first()
                print(album)
                if not album:
                    tDuration = duration  # Initialize total duration to the current song's duration
                    print("current_user.id")
                    artistId = current_user.id
                    # artistId = 1
                    album = Album(aName=album_title, album_release=date, album_duration=duration, artist_id=artistId)
                    db.session.add(album)
                    db.session.commit()
                    print("album created")
                else:
                    print("album")
                    tDuration = album.album_duration + duration  # Update the total duration of the existing album
                    album.album_duration = tDuration
                    db.session.commit()

                # Continue with the song upload
                if audio_file and image_file:
                    print("file")
                    audio_path = os.path.join(app.config["UPLOAD_FOLDER"], audio_file.filename)
                    image_path = os.path.join(app.config["IMAGE_FOLDER"], image_file.filename)

                    audio_file.save(audio_path)
                    image_file.save(image_path)
                    print(audio_path, image_path)
                    # artistId = 5
                    artistId = current_user.id
                    print(artistId)

                    new_song = Song(
                        sName=title,
                        lyrics=lyrics,
                        image_path='/images/' + image_file.filename,
                        mp3_path='/audio/' + audio_file.filename,
                        artist_id=artistId,
                        artistname=singer,
                        song_release=date,
                        song_duration=duration,
                        genre_id=genre.genre_id,
                        album_id=album.album_id  # Set the album_id
                    )
                    db.session.add(new_song)
                    db.session.commit()
                    print("file entry")
                else:
                    print("db entry")
                    new_song = Song(
                        sName=title,
                        lyrics=lyrics,
                        artist_id=current_user.id,
                        artistname=singer,
                        song_release=date,
                        song_duration=duration,
                        genre_id=genre.genre_id,
                        album_id=album.album_id  # Set the album_id
                    )
                    db.session.add(new_song)
                    db.session.commit()
                cache.clear()
                return jsonify({"message":"Song Upload Successfully"})
        except Exception as e:
            print("in except")
            print(f"An error occurred: {str(e)}")
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

api.add_resource(SongApi, "/song","/update/song/<int:song_id>","/delete/song/<int:song_id>")        
        
class PlaylistApi(Resource):
    @auth_required("token")
    def get(self, name=None):
        if name:
            playlist = Playlist.query.filter_by(user_id=current_user.id, pName=name).first()
            if playlist:
                # Fetch the playlist ID
                playlist_id = playlist.playlist_id
                # Marshal each song with song_fields
                songs = [marshal(song, song_fields) for song in playlist.songs]
                # Update the playlistid for each song
                for song in songs:
                    song['playlistid'] = playlist_id
                print(songs)
                return songs
            else:
                return jsonify({"message": "Playlist not found"}), 404
        else:
            playlists = Playlist.query.filter_by(user_id=current_user.id).all()
            if playlists:
                playlists_data = [
                    {
                        "playlist_id": playlist.playlist_id,
                        "pName": playlist.pName,
                        "status": playlist.status,
                        "tracks": playlist.tracks,
                        "user_id": playlist.user_id,
                        "song_ids": [song.song_id for song in playlist.songs]
                    }
                    for playlist in playlists
                ]
                return jsonify(playlists_data)
            else:
                return jsonify({"message": "Playlist not found"})

    @auth_required("token")
    def delete(self, name=None, id=None):
        if id:
            # Delete specific song from playlist
            playlist = Playlist.query.filter_by(user_id=current_user.id).filter(Playlist.songs.any(song_id=id)).first()
            if playlist:
                playlist.songs = [song for song in playlist.songs if song.song_id != id]
                db.session.commit()
                return jsonify({"message": "Song removed from playlist successfully"})
            else:
                return jsonify({"message": "Playlist or song not found"})
        elif name:
            # Delete entire playlist
            playlists = Playlist.query.filter_by(user_id=current_user.id, pName=name).all()
            if playlists:
                for playlist in playlists:
                    db.session.delete(playlist)
                db.session.commit()
                return jsonify({"message": "Successfully Deleted"})
            else:
                return jsonify({"message": "Playlist not found"})
        else:
            return jsonify({"message": "Invalid request. Provide playlist name or song ID."})

    @auth_required("token")
    def post(self):
        data = request.get_json()
        playlistTitle = data.get("title")
        selected_songs = data.get('songs')
        status = data.get('status')
        playlists = Playlist.query.filter_by(user_id=current_user.id, pName=playlistTitle).all()
        if len(playlists) == 0:
            playlist = Playlist(pName=playlistTitle, user_id=current_user.id, tracks=len(selected_songs), status=status)
            for song_id in selected_songs:
                song = Song.query.get(song_id)
                if song:
                    playlist.songs.append(song)
                    db.session.add(playlist)
                else:
                    return jsonify({"message": f"Song with ID {song_id} not found"}), 404
            db.session.commit()
            return jsonify({"message": "Successfully ADDED"})
        else:
            return jsonify({"message": "This Name's Playlist Already Present"})

    @auth_required("token")
    def put(self,playlistid):
        if playlistid:
            this_playlist = Playlist.query.filter_by(user_id=current_user.id, playlist_id=playlistid).all()
            if this_playlist:
                playlist_data = request.get_json()
                # status = playlist_data.get("status")
                name = playlist_data.get("pName")
                for playlist in this_playlist:
                    if name:
                        playlist.pName = name
                    # if status:
                    #     playlist.status = status
                db.session.commit()
                return jsonify({"message": "Successfully UPDATE"})
            else:
                return jsonify({"message": "Playlist not found"})
        else:
            return jsonify({"message": "No playlist name provided"})



api.add_resource(PlaylistApi, "/playlist", "/playlist/<name>","/update/playlist/<int:playlistid>", "/delete/playlist/<name>", "/delete/playlist/song/<int:id>")


