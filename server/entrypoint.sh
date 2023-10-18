#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"

    # Check if the "migrations" folder exists
    sleep 3
    if [ -d "migrations" ]; then
        echo "Migrations folder found. Check for pending changes..."
        python3 -m flask db check

        # Check the exit code of the previous command
        if [ $? -ne 0 ]; then
            echo "Pending changes are detected... generate changes"
            python3 -m flask db migrate
            python3 -m flask db upgrade
        else
            echo "No changes detected"
        fi
    else
        echo "Migrations folder not found. Create init migrations."
        python3 -m flask db init
    fi

fi

#python3 -m manage reset_db
# python3 -m flask db migrate
# python3 -m flask db upgrade
python manage.py create_db


exec "$@"