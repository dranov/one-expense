DEBUG = True
API_VERSION = '1'
API_URL_PREFIX = '/api/'

DB_HOST = 'localhost'
DB_PORT = 3306

DB_NAME = 'oxp'
DB_USER = 'root'
DB_PASS = 'redteam'


# Override with personal settings (my_settings.py) if available
try:
    from my_settings import *
except ImportError:
    pass
