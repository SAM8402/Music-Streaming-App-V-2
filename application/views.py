from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required, login_user, current_user, roles_accepted,login_required,logout_user  
from .models import User, db, Role, Album, Song,SongRating,Genre,Album
from flask_restful import marshal, fields
from werkzeug.security import check_password_hash, generate_password_hash
from .sec import datastore
import matplotlib.pyplot as plt
import bcrypt
from .tasks import create_resource_csv
import flask_excel as excel
from celery.result import AsyncResult
from .instances import cache



@app.get('/')
def home():
    return render_template("index.html")

@app.get('/download-csv')
@auth_required("token")
@roles_accepted('artist', 'admin')
def download_csv():
    Id =  current_user.id
    task = create_resource_csv.delay(Id)
    return jsonify({"task-Id":task.id})

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404



@app.get('/change_activate/artist/<int:artist_id>')
@auth_required("token")
@roles_required("admin")
def toggle_artist_role(artist_id):
    # Retrieve the user by ID
    artist = User.query.get(artist_id)
    if not artist:
        return jsonify({"message": "User not found"}), 404
    
    # Check if the user currently has the 'artist' role
    if any(role.name == 'artist' for role in artist.roles):
        # Remove the 'artist' role from the user's roles
        artist_role = Role.query.filter_by(name='artist').first()
        if not artist_role:
            return jsonify({"message": "Artist role not found"}), 404
        artist.roles.remove(artist_role)
        # Add the 'user' role to the user's roles
        user_role = Role.query.filter_by(name='user').first()
        if not user_role:
            return jsonify({"message": "User role not found"}), 404
        artist.roles.append(user_role)
        db.session.commit()
        return jsonify({"message": "User role changed to user"})
    else:
        # Remove the 'user' role from the user's roles
        user_role = Role.query.filter_by(name='user').first()
        if not user_role:
            return jsonify({"message": "User role not found"}), 404
        artist.roles.remove(user_role)
        # Add the 'artist' role to the user's roles
        artist_role = Role.query.filter_by(name='artist').first()
        if not artist_role:
            return jsonify({"message": "Artist role not found"}), 404
        artist.roles.append(artist_role)
        db.session.commit()
        return jsonify({"message": "User role changed to artist"})



@app.get('/change_role/artist')
@auth_required("token")
def change_role():
    artist = User.query.get(current_user.id)
    if not artist:
        return jsonify({"message": "User not found"}), 404

    if any(role.name == 'artist' for role in artist.roles):
        return jsonify({"message": "User is already an artist"})

    # Get the 'artist' role from the database
    artist_role = Role.query.filter_by(name='artist').first()
    if not artist_role:
        return jsonify({"message": "Artist role not found"}), 404

    if artist.active:
    # Add the 'artist' role to the user's roles
        artist.roles = []
        artist.roles.append(artist_role)
        db.session.commit()

    return jsonify({"message": "User role changed to artist"}), 200


@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email:
        return jsonify({"message": "email not provided"}), 400

    user = datastore.find_user(email=email)
    # print(user.username, user.password, user.roles)
    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if bcrypt.checkpw(password.encode('utf-8'), user.password):
        print("password verified")
        login_user(user)
        db.session.commit()
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Wrong Password"}), 400
    
@app.route('/user-logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
        return jsonify({'message': 'User is logged out'})
    else:
        return jsonify({'message': 'User is not logged in'})



@app.post('/user-signup')
def user_signup():
    data = request.get_json()
    if data is None:
        return jsonify({"message": "Invalid JSON data"}), 400
    email = data.get('email')
    password = data.get('password')
    Username = data.get('Username')
    if not email:
        return jsonify({"message": "email not provided"}), 400
    if not password:
        return jsonify({"message": "Password not provided"}), 400
    if not Username:
        return jsonify({"message": "Username not provided"}), 400

    datastore.find_or_create_role(name="user", description="User is a user")
    db.session.commit()

    if not datastore.find_user(email=email):
        user =datastore.create_user(
            email=email,
            username=Username,
            password= bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()),
            # roles=["user"]
            )
        datastore.add_role_to_user(user, 'user')
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    else:
        return jsonify({"message": "This Email is already registered"}), 400


user_fields = {
    "id": fields.Integer,
    "username": fields.String,
    "email": fields.String,
    "active": fields.Boolean,
    "role": fields.List(fields.String)
}


@app.get('/users')
@auth_required("token")
@roles_required("admin")
def all_artists():
    users = User.query.filter(User.roles.any(Role.name != 'admin')).all()
    if not users:
        return jsonify({"message": "No User Found"}), 404
    users_with_roles = []
    for user in users:
        user_data = marshal(user, user_fields)
        user_data['role'] = [role.name for role in user.roles]
        users_with_roles.append(user_data)
    return jsonify(users_with_roles)



@app.post('/rating/<int:song_id>')
@auth_required("token")
def play(song_id):
    song = Song.query.get(song_id)
    if song:
        rating = int(request.json.get("rating"))
        if rating is not None:
            # Check if the current user owns the song
                song_rating = SongRating.query.filter_by(song_id=song_id, user_id=current_user.id).first()
                if song_rating:
                    song_rating.rating = rating
                else:
                    song_rating = SongRating(song_id=song_id, user_id=current_user.id, rating=rating)
                    db.session.add(song_rating)
                db.session.commit()
                return jsonify({"message": "Rating updated successfully"})
        else:
            return jsonify({"message": "Invalid rating value"}), 400
    else:
        return jsonify({"message": "Song not found"}), 404



@app.route('/song/<int:song_id>', methods=['GET'])
@auth_required("token")
def get_song_by_id(song_id):
    song = Song.query.get(song_id)
    genre = Genre.query.get(song.genre_id)
    album = Album.query.get(song.album_id)
    if song:
        return jsonify({"song": {
            "song_id": song.song_id,
            "title": song.sName,
            "image_path": song.image_path,
            "mp3_path": song.mp3_path,
            "lyrics": song.lyrics,
            "artistname": song.artistname,
            "song_release": song.song_release,
            "song_duration": song.song_duration,
            "aName": album.aName,
            "gName": genre.gName,
        }})
    else:
        return jsonify({"message": "Song not found"}), 404


@app.route("/graph")  # ! done
@auth_required("token")
@roles_accepted('artist', 'admin')
def artist_dashboard():
    print(current_user.id)
    songs = Song.query.all()
    albums = Album.query.all()
    artists = User.query.filter(User.roles.any(Role.name == 'artist')).all()
    users = User.query.filter(User.roles.any(Role.name == 'user')).all()

    total_albums = len(albums)

    if current_user.has_role('artist'):
        songs = Song.query.filter_by(artist_id=current_user.id).all()
        total_albums = Album.query.filter_by(artist_id=current_user.id).count()

    total_rating = 0
    total_songs = len(songs)
    total_user = len(users)
    total_artist = len(artists)

    for song in songs:
        song_rating = SongRating.query.filter_by(song_id=song.song_id).first()
        if song_rating:
            total_rating += song_rating.rating

    avg_rating = total_rating / total_songs if total_songs > 0 else 0

    flagged_songs_count = {}
    for artist in artists:
        flagged_songs_count[artist.username] = 0
        for song in artist.songs:
            if not song.sFlag:
                flagged_songs_count[artist.username] += 1

    song_titles = [song.sName for song in songs]
    song_ratings = []
    for song in songs:
        ratings = SongRating.query.filter_by(song_id=song.song_id).all()
        if ratings:
            avg_rating = sum([rating.rating for rating in ratings]) / len(ratings)
            song_ratings.append(avg_rating)
        else:
            song_ratings.append(0)
    plt.figure(figsize=(8, 4))  # Define the figure size
    plt.bar(song_titles, song_ratings)
    plt.xlabel('Song')
    plt.ylabel('Rating')
    plt.title('Songs and their Ratings')

    # Save the graph to the static folder
    graph = 'static/Song_rating_graph.png'

    plt.savefig(graph)

    # Clear the figure for the next graph
    plt.clf()

    plt.figure(figsize=(8,4))  # Define the figure size
    bar_width = 0.3
    bars1 = plt.bar('Users', total_user, width=bar_width,
                    color='b', align='center')
    bars2 = plt.bar('Artists', total_artist, width=bar_width,
                    color='g', align='center')
    bars3 = plt.bar('Albums', total_albums, width=bar_width,
                    color='r', align='center')
    plt.xlabel('Categories')
    plt.ylabel('Number')
    plt.title('Number of Users, Artists and Albums ')
    plt.legend((bars1[0], bars2[0], bars3[0]), ('Users', 'Artists', 'Albums'))

    # Save the graph to the static folder
    graph1 = 'static/user_artist_graph.png'
    plt.savefig(graph1)

    # Clear the figure for the next graph
    plt.clf()

    return jsonify({"avg_rating": avg_rating,
                    "total_albums": total_albums,
                    "total_songs": total_songs,
                    "total_user": total_user,
                    "total_artist": total_artist,
                    "flagged_songs_count": flagged_songs_count})


    # if artist:
    #         if artist.flag:
    #             return render_template("artistDashboad.html", songs=songs,albums=albums, artist=artist, total_songs=total_songs, total_albums=total_albums, avg_rating=avg_rating, artist_id=artist_id,graph="../static/Artist_song_rating_graph.png")
    #         else:
    #             return jsonify({"message":"You Are Blacklisted"})
    # else:
    #     return jsonify({"message":"You Are Not Artist"})
