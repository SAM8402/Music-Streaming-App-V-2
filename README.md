# Music Streaming Application Backend (v2)

A comprehensive Flask-based backend for a music streaming application with user authentication, role-based access control, playlist management, and artist features.

## 🎵 Features

### Core Functionality
- **User Authentication & Authorization**: Flask-Security integration with token-based authentication
- **Role-Based Access Control**: Support for Admin, Artist, and User roles
- **Music Management**: Complete CRUD operations for songs, albums, and genres
- **Playlist Management**: Create, update, delete, and manage playlists
- **File Upload**: Support for audio files (MP3) and album artwork (images)
- **Rating System**: Users can rate songs
- **Content Moderation**: Admin can flag/unflag songs and albums

### Advanced Features
- **Caching**: Redis-based caching for improved performance
- **Background Tasks**: Celery integration for asynchronous task processing
- **Scheduled Tasks**: Daily reminders, chat notifications, and monthly reports
- **Data Export**: CSV export functionality for artist data
- **Email Integration**: Mail service for notifications
- **API Documentation**: RESTful API with proper response formatting

## 🏗️ Architecture

### Technology Stack
- **Framework**: Flask 2.2.3
- **Database**: SQLite (SQLAlchemy ORM)
- **Authentication**: Flask-Security-Too
- **API**: Flask-RESTful
- **Caching**: Redis with Flask-Caching
- **Task Queue**: Celery with Redis broker
- **File Handling**: Flask-Excel for CSV operations
- **CORS**: Flask-CORS for cross-origin requests

### Project Structure
```
backend1/
├── application/                 # Main application package
│   ├── instances.py            # Application instances (cache, etc.)
│   ├── mail_service.py         # Email service configuration
│   ├── models.py               # Database models
│   ├── resources.py            # REST API endpoints
│   ├── sec.py                  # Security configuration
│   ├── tasks.py                # Celery background tasks
│   ├── views.py                # Flask routes and views
│   └── worker.py               # Celery worker configuration
├── static/                     # Static files
│   ├── audio/                  # Music files storage
│   ├── images/                 # Album artwork storage
│   └── components/             # Frontend JavaScript components
├── templates/                  # HTML templates
├── instance/                   # Instance-specific files
│   └── database.db            # SQLite database
├── config.py                   # Configuration settings
├── main.py                     # Application entry point
├── requirements.txt            # Python dependencies
└── celeryconfig.py            # Celery configuration
```

## 📊 Database Schema

### Core Models
- **User**: User accounts with authentication and role management
- **Role**: User roles (admin, artist, user)
- **Song**: Music tracks with metadata
- **Album**: Album information and relationships
- **Genre**: Music genres
- **Playlist**: User-created playlists
- **SongRating**: User ratings for songs
- **PlaylistSongAssociation**: Many-to-many relationship for playlists and songs

### Key Relationships
- Users can have multiple roles
- Artists can create multiple albums and songs
- Songs belong to albums and genres
- Users can create multiple playlists
- Playlists can contain multiple songs
- Users can rate songs

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- Redis server
- SQLite

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend1
   ```

2. **Create virtual environment**
   ```bash
   python -m venv my_env
   source my_env/bin/activate  # On Windows: my_env\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables** (optional)
   Create a `.env` file with your configurations:
   ```
   SECRET_KEY=your-secret-key
   SECURITY_PASSWORD_SALT=your-salt
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

5. **Initialize the database**
   ```bash
   python
   >>> from main import app
   >>> from application.models import db
   >>> with app.app_context():
   ...     db.create_all()
   >>> exit()
   ```

6. **Start Redis server**
   ```bash
   redis-server
   ```

7. **Start Celery worker** (in separate terminal)
   ```bash
   celery -A main:celery_app worker --loglevel INFO
   ```

8. **Start Celery beat scheduler** (in separate terminal)
   ```bash
   celery -A main:celery_app beat -l INFO
   ```

9. **Run the application**
   ```bash
   python main.py
   ```

The application will be available at `http://localhost:5000`

## 🔧 Configuration

### Development Configuration
- **Database**: SQLite database stored in `instance/database.db`
- **File Upload**: Audio files stored in `static/audio/`, images in `static/images/`
- **Cache**: Redis cache on localhost:6379 (database 3)
- **Debug Mode**: Enabled for development

### Security Configuration
- Token-based authentication
- Password hashing with bcrypt
- CORS enabled for cross-origin requests
- Role-based access control

## 📚 API Documentation

### Authentication
All API endpoints require authentication using token-based authentication.
```
Authentication-Token: <your-token>
```

### Main Endpoints

#### Genres
- `GET /api/all_genre` - Get all genres (cached)

#### Albums
- `GET /api/all_album` - Get all albums (admin view)
- `GET /api/album` - Get artist's albums
- `PUT /api/update/album/<album_id>` - Update album
- `DELETE /api/delete/album/<album_id>` - Delete album
- `PUT /api/flag_album/<album_id>` - Flag/unflag album

#### Songs
- `GET /api/all_song` - Get all songs (admin view)
- `GET /api/song` - Get artist's songs
- `POST /api/song` - Upload new song
- `PUT /api/update/song/<song_id>` - Update song
- `DELETE /api/delete/song/<song_id>` - Delete song
- `PUT /api/flag_song/<song_id>` - Flag/unflag song

#### Playlists
- `GET /api/playlist` - Get user's playlists
- `GET /api/playlist/<name>` - Get specific playlist
- `POST /api/playlist` - Create new playlist
- `PUT /api/update/playlist/<playlist_id>` - Update playlist
- `DELETE /api/delete/playlist/<name>` - Delete playlist
- `DELETE /api/delete/playlist/song/<song_id>` - Remove song from playlist

### Response Format
```json
{
  "message": "Success message",
  "data": { ... }
}
```

## ⚡ Background Tasks

### Scheduled Tasks
- **Daily Reminder**: Sends daily notifications (12:00 AM)
- **Chat Space Message**: Posts to chat platforms (12:00 AM)
- **Monthly Report**: Generates monthly reports (12:00 AM on 30th)

### Async Tasks
- **CSV Export**: Generate and download CSV reports
- **File Processing**: Handle large file uploads

## 📁 File Management

### Supported Formats
- **Audio**: MP3 files
- **Images**: Common image formats (PNG, JPG, etc.)

### Storage Structure
- Audio files: `static/audio/`
- Album artwork: `static/images/`
- File paths stored in database with relative URLs

## 🛡️ Security Features

- **Authentication**: Token-based authentication system
- **Authorization**: Role-based access control (Admin, Artist, User)
- **Password Security**: Bcrypt hashing
- **Input Validation**: Request validation and sanitization
- **File Security**: Secure file upload handling
- **CORS Protection**: Configured for secure cross-origin requests

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Set production values for secrets
2. **Database**: Consider PostgreSQL for production
3. **File Storage**: Use cloud storage (AWS S3, etc.)
4. **Caching**: Redis cluster for high availability
5. **Task Queue**: Celery with proper broker setup
6. **Monitoring**: Add application monitoring and logging

### Docker Deployment (Recommended)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "main.py"]
```

## 🧪 Testing

### Running Tests
```bash
# Install test dependencies
pip install pytest pytest-flask

# Run tests
pytest
```

### Test Coverage
- Unit tests for models
- API endpoint testing
- Authentication testing
- File upload testing

## 🔍 Monitoring & Logging

### Health Checks
- Database connectivity
- Redis connectivity
- Celery worker status

### Logging
- Application logs
- Error tracking
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📝 License

This project is developed as part of a MAD-II (Modern Application Development) course project.

## 👥 Team

- Project developed for MAD-II course
- Backend implementation in Flask
- Frontend components included

## 📞 Support

For issues and support:
1. Check the troubleshooting section
2. Review API documentation
3. Submit issues with detailed descriptions

---

**Version**: 2.0  
**Last Updated**: 2024  
**Python Version**: 3.8+  
**Flask Version**: 2.2.3
