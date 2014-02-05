#! /usr/bin/python

import oxp.storage
import faker, random

NUM_FAKE_CATEGORIES = 10
NUM_FAKE_EXPENSES = 100

oxp.storage.db.connect()
oxp.storage.Expense.create_table()
oxp.storage.Category.create_table()

fake = faker.Faker()

# Add fake categories
for cat in range(NUM_FAKE_CATEGORIES):
    cat = oxp.storage.Category(name=fake.bs())
    cat.save()


# Add fake expenses
for exp in range(NUM_FAKE_EXPENSES):
    exp = oxp.storage.Expense(name=fake.word(),
            sum=fake.random_number(digits=4),
            category_id=random.randint(1, NUM_FAKE_CATEGORIES))
    exp.save()


