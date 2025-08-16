#!/bin/sh
set -e

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
        # python3 -m flask db init
       
    fi

fi

# python manage.py create_db
# python3 -m flask db migrate
# python3 -m flask db upgrade


#exec gunicorn --workers 4 --bind 0.0.0.0:${PORT:-5000} app:app
exec gunicorn \
    --workers 5 \
    --threads 2 \
    --bind 0.0.0.0:${PORT:-5000} \
    --timeout 60 \
    --keep-alive 2 \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    app:app
