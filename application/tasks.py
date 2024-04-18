from celery import shared_task
import flask_excel as excel
from .mail_service import send_message,send_reminder
from .models import User, Role, Song, Album, Genre,SongRating,db
from jinja2 import Template
from datetime import datetime, timedelta
import csv
from io import StringIO


from pandas import DataFrame

@shared_task(ignore_result=False)
def create_resource_csv(artist_id):
    # Query to retrieve data
    song_res = (
        Song.query
        .join(Album, Song.album_id == Album.album_id)
        .join(Genre, Song.genre_id == Genre.genre_id)
        .join(User, Song.artist_id == User.id)
        .join(SongRating, Song.song_id == SongRating.song_id)
        .with_entities(
            Song.artistname.label("Singer Name"),
            Song.sName.label("Song Name"),
            Song.sFlag.label("Flag Status"),
            User.username.label("Song Rated by"),
            SongRating.rating.label("Rating"),
            Song.song_release.label("Song Release Date"),
            Album.aName.label("Album Name"),
            Album.album_release.label("Album Release Date"),
            Genre.gName.label("Genre Name")
        )
        .filter(Song.artist_id == artist_id)
        .all()
    )

    # Define column names for CSV
    column_names = ["Singer Name", "Song Name", "Flag Status", "Song Rated by ", "Rating","Song Release Date", "Album Name","Album Release Date", "Genre Name"]

    # Create a pandas DataFrame from the query results
    df = DataFrame(song_res, columns=column_names)

    filename = "test.csv"

    # Write DataFrame to CSV file
    df.to_csv(filename, index=False)

    return filename







@shared_task(ignore_result=False)
def chatSpaceMessage():
    from json import dumps
    from httplib2 import Http

    """Google Chat incoming webhook quickstart."""
    url = "https://chat.googleapis.com/v1/spaces/AAAAAzeCsrc/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=o3KSDNgeppTCQJzd6t8l6e_s4xhSU2zqHgolYzX8MOM"
    app_message = {"text": "Hey We Are Missing You Come and Listen The Trending Song!"}
    message_headers = {"Content-Type": "application/json; charset=UTF-8"}
    http_obj = Http()
    response = http_obj.request(
        uri=url,
        method="POST",
        headers=message_headers,
        body=dumps(app_message),
    )
    print(response)
    return "Message Sent !!"



@shared_task(ignore_result=True)
def daily_reminder():
    cutoff_time = datetime.now() - timedelta(hours=24)
    users = User.query.filter(User.roles.any(Role.name != 'admin'),User.last_login_at > cutoff_time).all()
    for user in users:
        send_reminder(user.email, "Daily Reminder for " + user.username,user.username)
        
    return "OK"
@shared_task(ignore_result=True)
def monthly_report():
    users = User.query.filter(User.roles.any(Role.name == 'artist')).all()
    for user in users:
        create_resource_csv(user.id)
        send_message(user.email, "Monthly Report for " + user.username,
                         "Hello, " + user.username+" ,Your this month report")
    return "OK"
