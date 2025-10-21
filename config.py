import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'una-clave-secreta-muy-segura'
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:12345678@localhost:5433/makeup_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de PayPal desde variables de entorno
    PAYPAL_MODE = 'sandbox'  # Corregido 'sanbox' a 'sandbox'

    PAYPAL_CLIENT_ID = 'AYujnXtepsxbrazDJZFCgbVpqiCNYfc5UalANOiFe6KKRUOxxLG0Ypr0Iy2orRpkQU75CQKXslcHDOSa'
    PAYPAL_CLIENT_SECRET = 'EHRo6iJTv3DvibwMPN4MjQqRrEIrhzexYB9JoEBYFt2UB_o86dy9KVhOzMQkacNnzEtcU1N-0XnoQs3F'