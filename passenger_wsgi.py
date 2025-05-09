import os
import sys

# Set up paths
INTERP = os.path.expanduser("/usr/bin/python3")
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

# Add application directory to Python path
sys.path.append(os.getcwd())

# Set environment variables
os.environ['PYTHONPATH'] = os.getcwd()
os.environ['NODE_ENV'] = 'production'
os.environ['PORT'] = '3000'

# Function required by Passenger
def application(environ, start_response):
    start_response('200 OK', [('Content-Type', 'text/plain')])
    return [b'Passenger is configured correctly'] 