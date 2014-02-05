#! /usr/bin/python
import flask
import json

import faker
import random

import oxp.settings as settings

app = flask.Flask(__name__)
fake = faker.Faker()

def get_request_response(content):
    response = flask.make_response(content)
    response.headers['API-Version'] = settings.API_VERSION
    response.headers['Content-Type'] = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    
    return response


# POST JSON {email, pass}
@app.route(settings.API_URL_PREFIX + 'register', methods=['POST'])
def register_user():
    pass


# POST JSON {email, pass}
@app.route(settings.API_URL_PREFIX + 'login', methods=['POST'])
def login():
    pass


# POST {name, sum}
@app.route(settings.API_URL_PREFIX + 'expense', methods=['POST'])
def add_expense():
    pass


# GET
@app.route(settings.API_URL_PREFIX + 'expenses', methods=['GET'])
def get_all_expenses():
    expenses = dict()

    for exp in range(random.randint(3, 15)):
        expenses[exp] = {
            'name': fake.word(),
            'sum': fake.random_number(digits=4),
            'category_id': random.randrange(10)
        }

    return get_request_response(json.dumps(expenses))


# POST {name}
@app.route(settings.API_URL_PREFIX + 'category', methods=['POST'])
def add_category():
    pass


# GET
@app.route(settings.API_URL_PREFIX + 'categories')
def get_all_categories():
    categories = dict()

    for cat in range(10):
        categories[cat] = fake.bs()

    return get_request_response(json.dumps(categories))



@app.route(settings.API_URL_PREFIX + 'version', methods=['GET'])
def get_api_version():
    content = {'API-Version': settings.API_VERSION}
    return get_request_response(json.dumps(content))


@app.route(settings.API_URL_PREFIX + 'endpoints', methods=['GET'])
def list_endpoints():
    endpoints = {
        'version': ['GET'],
        'endpoints': ['GET'],
        'category': ['POST'],
        'categories': ['GET'],
        'expense': ['POST'],
        'expenses': ['GET'],
        'login': ['POST'],
        'register': ['POST']
    }

    return get_request_response(json.dumps(endpoints))


if __name__ == '__main__':
    app.debug = settings.DEBUG
    app.run(host='0.0.0.0')
