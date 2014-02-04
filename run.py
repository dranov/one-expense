#! /usr/bin/python

import subprocess
import signal
import sys
import os

API_SERVER_CMD = './backend/api.py'
HTTP_SERVER_CMD = '/usr/bin/python -m SimpleHTTPServer 8000'

api_srv = None
web_srv = None

def handle_sigint(signum, frame):
    api_srv.kill()
    web_srv.kill()
    sys.exit(0)

if __name__ == '__main__':
    api_server = subprocess.Popen(API_SERVER_CMD , shell=True)

    os.chdir('./frontend')
    web_server = subprocess.Popen(HTTP_SERVER_CMD, shell=True)

    api_srv = api_server
    web_srv = web_server

    signal.signal(signal.SIGINT, handle_sigint)
    signal.pause()





