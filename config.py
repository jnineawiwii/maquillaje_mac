import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'una-clave-secreta-muy-segura'
    
    # Usar DATABASE_URL de Render o fallback a local
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        # Render usa postgres:// pero SQLAlchemy necesita postgresql://
        SQLALCHEMY_DATABASE_URI = database_url.replace('postgres://', 'postgresql://')
    else:
        # Configuración local de respaldo
        SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:12345678@localhost:5433/makeup_db'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de PayPal desde variables de entorno
    PAYPAL_MODE = os.environ.get('PAYPAL_MODE', 'sandbox')  # Corregido 'sanbox' a 'sandbox'
    PAYPAL_CLIENT_ID = os.environ.get('PAYPAL_CLIENT_ID', '')
    PAYPAL_CLIENT_SECRET = os.environ.get('PAYPAL_CLIENT_SECRET', '')