#! /usr/bin/python
import flask
import json

import oxp.settings

app = flask.Flask(__name__)

def get_request_response(content):
    response = flask.make_response(content)
    response.headers['API-Version'] = oxp.settings.api_version
    response.headers['Content-Type'] = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    
    return response

@app.route('/api/' + 'version')
def get_api_version():
    content = {'API-Version': oxp.settings.api_version}
    return get_request_response(json.dumps(content))

if __name__ == '__main__':
    app.debug = oxp.settings.debug
    app.run(host='0.0.0.0')
