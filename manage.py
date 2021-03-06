import os
from flask.ext.script import Manager, Server
from flask.ext.migrate import Migrate, MigrateCommand

from app import app, db



app.config.from_object(os.environ['APP_SETTINGS'])

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)
manager.add_command('runserver', Server(host='0.0.0.0', port=3000))



if __name__ == '__main__':
    manager.run()
