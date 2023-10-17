# pull official base image
FROM python:3.11.3-slim-buster

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install system dependencies
RUN apt-get update && apt-get install -y netcat

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt
ENV FLASK_APP=app.py

# copy project
COPY . /usr/src/app/

EXPOSE 5001
# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]