from flask import Flask

app = Flask(__name__)

# Support both Replit domain and custom domain
CUSTOM_DOMAIN = 'www.justice-bot.com'
app.config['SERVER_NAME'] = None  # Allow all domains

# ...your existing routes and