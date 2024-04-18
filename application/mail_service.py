from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import os
import pandas as pd
import base64

SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'admin@email.com'
SENDER_PASSWORD = ''

def send_message(to, subject, content_body, csv_data='test.csv'):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["From"] = SENDER_EMAIL
    msg["Subject"] = subject
    
    # Convert CSV data to HTML table
    html_table = pd.read_csv(csv_data).to_html(index=False)
    with open(csv_data, 'rb') as f:
        csv_content = f.read()
    csv_base64 = base64.b64encode(csv_content).decode('utf-8')

    # Attach HTML content to the email
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Content</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #007bff; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1>Month Report !!</h1>
            </div>
            <div style="padding: 20px;">
                <p>{content_body}</p>
                <p>{html_table}</p>
                <a style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px;" download="{csv_data}" href="data:text/csv;base64,{csv_base64}">Download CSV</a>
                <p style="text-align: center; margin-top: 20px;">Click the button above to download the CSV file.</p>
            </div>
        </div>
    </body>
    </html>
    """
    msg.attach(MIMEText(html_content, 'html'))

    # Attach CSV file as an attachment
    with open(csv_data, 'rb') as f:
        att = MIMEApplication(f.read(), _subtype="csv")
        att.add_header('Content-Disposition', 'attachment', filename=os.path.basename(csv_data))
    msg.attach(att)

    # Send email
    with SMTP(host=SMTP_HOST, port=SMTP_PORT) as client:
        client.send_message(msg=msg)
        
def send_reminder(to, subject,Name):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["From"] = SENDER_EMAIL
    msg["Subject"] = subject

    name = Name.title()
    # Attach HTML content to the email
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
        /* Inline styles will be inserted here */
        </style>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div class="container" style="width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <div class="header" style="background-color: #007bff; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">We Miss You! {name}</h1>
        </div>
        <div class="content" style="padding: 20px;">
            <p>Hey there,</p>
            <p>We noticed you haven't visited us for a while. Come back and listen to the latest trending songs!</p>
            <p style="margin-bottom: 20px;">Best Regards,<br>Music Streaming Service Team</p>
            <a href="http://127.0.0.1:5000/" class="button" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px;">Listen Now</a>
        </div>
        </div>
    </body>
    </html>
"""
   
    msg.attach(MIMEText(html_content, 'html'))

    # Send email
    with SMTP(host=SMTP_HOST, port=SMTP_PORT) as client:
        client.send_message(msg=msg)
        # client.quit()

# Example usage
# send_message('imran@email.com', 'Test Email', 'This is a test email with embedded CSV data.')
