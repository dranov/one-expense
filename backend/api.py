#! /usr/bin/python
import flask
import json

import faker
import random

import oxp.settings as settings
import oxp.storage as storage
from oxp.crossdomain import *

app = flask.Flask(__name__)
fake = faker.Faker()

def get_request_response(content):
    response = flask.make_response(content)
    response.headers['API-Version'] = settings.API_VERSION
    response.headers['Content-Type'] = 'application/json'
    
    return response


# POST JSON {email, pass}
@app.route(settings.API_URL_PREFIX + 'register', methods=['POST', 'OPTIONS'])
@crossdomain(origin='*')
def register_user():
    pass


# POST JSON {email, pass}
@app.route(settings.API_URL_PREFIX + 'login', methods=['POST', 'OPTIONS'])
@crossdomain(origin='*')
def login():
    pass


# POST {name, sum}
@app.route(settings.API_URL_PREFIX + 'expense', methods=['POST', 'OPTIONS'])
@crossdomain(origin='*', headers='access-control-allow-origin,content-type')
def add_expense():
    if flask.request.method == 'POST':
        # The get_json() method is badly named; it also parses the JSON
        e = flask.request.get_json()

        # If object isn't an expense, bad request
        if (e is None) or ('name' not in e) or ('sum' not in e) or ('category_id' not in e):
            flask.abort(400)

        db_exp = storage.Expense(name=e['name'], sum=e['sum'],
                category_id=e['category_id'])
        db_exp.save()


        #TODO: return expense id?
        return get_request_response('')



# GET
@app.route(settings.API_URL_PREFIX + 'expenses', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_all_expenses():
    if flask.request.method == 'GET':
        expenses = dict()

        for e in storage.Expense.select():
            expenses[e.id] = {'name': e.name, 'sum': e.sum,
                    'category_id': e.category_id}

        return get_request_response(json.dumps(expenses))



# POST {name}
@app.route(settings.API_URL_PREFIX + 'category', methods=['POST', 'OPTIONS'])
@crossdomain(origin='*', headers='access-control-allow-origin,content-type')
def add_category():
    if flask.request.method == 'POST':
        # The get_json() method is badly named; it also parses the JSON
        c = flask.request.get_json()

        # If object isn't a category, bad request
        if (c is None) or ('name' not in c):
            flask.abort(400)

        db_cat = storage.Category(name=c['name'])
        db_cat.save()


        #TODO: return category id?
        return get_request_response('')



# GET
@app.route(settings.API_URL_PREFIX + 'categories', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_all_categories():
    if flask.request.method == 'GET':
        categories = dict()

        for c in storage.Category.select():
            categories[c.id] = {'name': c.name}

        return get_request_response(json.dumps(categories))



@app.route(settings.API_URL_PREFIX + 'version', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_api_version():
    content = {'API-Version': settings.API_VERSION}
    return get_request_response(json.dumps(content))


@app.route(settings.API_URL_PREFIX + 'endpoints', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
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
