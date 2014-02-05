#! /usr/bin/python

import oxp.storage
import faker, random

oxp.storage.db.connect()
oxp.storage.Expense.create_table()
oxp.storage.Category.create_table()

fake = faker.Faker()

# Add fake categories
for cat in range(10):
    cat = oxp.storage.Category(name=fake.bs())
    cat.save()


# Add fake expenses
for exp in range(random.randint(3, 15)):
    exp = oxp.storage.Expense(name=fake.word(),
            sum=fake.random_number(digits=4),
            category_id=random.randrange(10))
    exp.save()


