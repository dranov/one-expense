import peewee
import oxp.settings as settings

db = peewee.MySQLDatabase(settings.DB_NAME, host=settings.DB_HOST,
        port=settings.DB_PORT, user=settings.DB_USER, passwd=settings.DB_PASS)


class Expense(peewee.Model):
    name = peewee.TextField()
    sum = peewee.DoubleField()
    category_id = peewee.BigIntegerField(null=True, default=None)

    class Meta:
        database = db

class Category(peewee.Model):
    name = peewee.TextField()
    color = peewee.TextField()

    class Meta:
        database = db
