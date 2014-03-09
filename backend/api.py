#! /usr/bin/python
import flask
import json

import faker
import random

import oxp.settings as settings
import oxp.storage as storage
from oxp.crossdomain import *

import time

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

        if e['sum'] < 0:
            return make_response(get_request_response(json.dumps('An expense cannot be negative.')), 400)



        db_exp = storage.Expense(name=e['name'], sum=e['sum'], category_id=e['category_id'], date=time.strftime("%Y-%m-%d %H:%M:%S"))
        db_exp.save()


        return get_request_response(json.dumps({'id': db_exp.id}))



# GET
@app.route(settings.API_URL_PREFIX + 'expenses', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_all_expenses():
    if flask.request.method == 'GET':
        expenses = dict()

        for e in storage.Expense.select():
            expenses[e.id] = {'name': e.name, 'sum': e.sum,
                    'category_id': e.category_id, 'date': e.date}

        return get_request_response(json.dumps(expenses))
        
        
# POST {name}
@app.route(settings.API_URL_PREFIX + 'category', methods=['POST', 'OPTIONS'])
@crossdomain(origin='*', headers='access-control-allow-origin,content-type')
def add_category():
    if flask.request.method == 'POST':
        # The get_json() method is badly named; it also parses the JSON
        c = flask.request.get_json()

        # If object isn't a category, bad request
        if (c is None) or ('name' not in c) or ('color' not in c):
            flask.abort(400)    

        # Don't accept categories with names that are longer than 50 characters
        if len( c['name'] ) > 50:
            return make_response(get_request_response(json.dumps('A category\'s name cannot exceed 50 characters')), 400)

        # Don't accept categories with names that already exist
        if storage.Category.select(storage.Category.name).where(storage.Category.name == c['name']).count() != 0:
            return make_response(get_request_response(json.dumps('A category named \'{0}\' already exists.'.format(c['name']))), 400)

        db_cat = storage.Category(name=c['name'], color=c['color'], date=time.strftime("%Y-%m-%d %H:%M:%S"))
        db_cat.save()

        return get_request_response(json.dumps({'id': db_cat.id}))

# GET
@app.route(settings.API_URL_PREFIX + 'categories', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_all_categories():
    if flask.request.method == 'GET':
        categories = dict()

        for c in storage.Category.select():
            categories[c.id] = {'name': c.name , 'color': c.color , 'date': c.date }

        return get_request_response(json.dumps(categories))


if __name__ == '__main__':
    app.debug = settings.DEBUG
    app.run(host='0.0.0.0')
