import os
import sys

# Set the environment variables
os.environ['NODE_ENV'] = 'production'
os.environ['PORT'] = '4000'
os.environ['HOST'] = '127.0.0.1'

# Add the application directory to the Python path
INTERP = os.path.expanduser("/opt/cpanel/ea-nodejs18/bin/node")
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

# Set the application path
sys.path.insert(0, os.getcwd())

# Start the Node.js application
from app import app as application 