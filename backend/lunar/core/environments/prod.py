
import os

from core.components.variables import BASE_DIR


os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.getenv('GOOGLE_CREDENTIALS_PATH')
HOST = os.getenv('HOST', '')

EMAIL_SENDER = os.getenv('EMAIL_SENDER')
