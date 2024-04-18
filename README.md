# Music-Streaming-App-V-2

This is a music streaming app that allows users to stream their favorite songs.

## Steps to run this app

1. Install WSL (Windows Subsystem for Linux) or use Linux.
2. Install virtualenv: `pip install virtualenv`
3. Create a virtual environment: `virtualenv my_env`
4. Activate the virtual environment: `source my_env/bin/activate`
5. Install the required packages: `pip install -r requirements.txt`
6. Install Redis: `https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-windows/`
    - Download and install the GPG key: `curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg`
    - Add the Redis repository: `echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list`
    - Update the package list: `sudo apt-get update`
    - Install Redis: `sudo apt-get install redis`
7. Start the Redis server: `redis-server`
8. Install Mailhog: Follow the instructions on the Mailhog GitHub page.
9. Start the Celery worker and beat: 
    - `celery -A main:celery_app worker --loglevel INFO`
    - `celery -A main:celery_app beat -l INFO`
10. `python3 upload_initial_data.py`
11. `python3 main.py`
    
If you encounter any errors during these steps, try to resolve them by referring to the official documentation of the respective tools. If the Redis server or Celery services are running correctly, you should see their logs in the console. To stop them, you can usually use `Ctrl+C`. After the setup, you can start using the app by... (include usage instructions here)
