from flask import Flask
from application.models import db,User,Role
from config import DevelopmentConfig
from application.resources import api
import os
from flask_security import roles_accepted, login_user
from application.sec import security, datastore
from flask_cors import CORS
from application.resources import *
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import daily_reminder,chatSpaceMessage,monthly_report
from application.instances import cache



# source my_env/bin/activate

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(app.config["IMAGE_FOLDER"], exist_ok=True)
    excel.init_excel(app)
    cache.init_app(app)
    
    with app.app_context():
        import application.views

    return app


app = create_app()
security.init_app(app, datastore)


celery_app = celery_init_app(app)
# celery -A main:celery_app worker --loglevel INFO
# celery -A main:celery_app beat -l INFO
# celery -A  main.celery_app beat --max-interval 1 -l info

# ~/go/bin/MailHog
# redis-server

    
celery_app.conf.beat_schedule = {
    'add_numbers_daily': {
        'task': 'application.tasks.daily_reminder',  # Name of the Celery task
        'schedule': crontab(hour=0, minute=12),  # Run at 7 PM daily
        # 'args': (4, 5),  # Arguments to pass to the task
    },
    'add_numbers_daily_on_Gsapce': {
        'task': 'application.tasks.chatSpaceMessage',  # Name of the Celery task
        'schedule': crontab(hour=0, minute=12),  # Run at 7 PM daily
        # 'args': (4, 5),  # Arguments to pass to the task
    },
    'add_monthly_report_at_7pm': {
        'task': 'application.tasks.monthly_report',  # Name of the Celery task
        'schedule': crontab(hour=0, minute=12, day_of_month=30),  # Run at 7 PM daily
    }
}



if __name__ == "__main__":
    app.run()
