#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"

    # Check if the "migrations" folder exists
    if [ -d "migrations" ]; then
        echo "Migrations folder found. Running database upgrade..."
    else
        echo "Migrations folder not found. Create init migrations."
        python3 -m flask db init
    fi

fi


python3 -m flask db migrate
python3 -m flask db upgrade
python manage.py create_db
#python manage.py seed_db

exec "$@"