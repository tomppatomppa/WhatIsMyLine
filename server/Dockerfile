# pull official base image
FROM python:3.11.3-slim-buster



# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# install system dependencies
# RUN apt-get update && apt-get install -y netcat

RUN sed -i 's|http://deb.debian.org/debian|http://archive.debian.org/debian|g' /etc/apt/sources.list \
 && sed -i 's|http://security.debian.org/debian-security|http://archive.debian.org/debian-security|g' /etc/apt/sources.list \
 && echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until \
 && apt-get update \
 && apt-get install -y netcat \
 && rm -rf /var/lib/apt/lists/*


# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

ENV FLASK_APP=app.py
ENV SKIP_TESTS=${SKIP_TESTS}

# copy project
COPY . /usr/src/app/
RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE 5001

# run entrypoint.sh
RUN ["chmod", "+x", "/usr/src/app/entrypoint.sh"]
#ENTRYPOINT ["/usr/src/app/entrypoint.sh"]