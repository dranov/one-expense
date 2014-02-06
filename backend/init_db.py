#! /usr/bin/python

import oxp.storage
import faker, random

NUM_FAKE_CATEGORIES = 10
NUM_FAKE_EXPENSES = 100

oxp.storage.db.connect()
oxp.storage.Expense.create_table()
oxp.storage.Category.create_table()

fake = faker.Faker()

# Random color
def get_random_color():
    color = '#'
    for i in range(6):
        value = random.randint(0,15)
        if value <= 9:
            color += chr(ord('0')+value)
        else:
            value -= 10
            color += chr(ord('a')+value)
            
    return color
        
            

# Add fake categories
for cat in range(NUM_FAKE_CATEGORIES):
    cat = oxp.storage.Category(name=fake.bs(), color=get_random_color())
    cat.save()


# Add fake expenses
for exp in range(NUM_FAKE_EXPENSES):
    exp = oxp.storage.Expense(name=fake.word(),
            sum=fake.random_number(digits=4),
            category_id=random.randint(1, NUM_FAKE_CATEGORIES))
    exp.save()


