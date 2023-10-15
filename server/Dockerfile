FROM python:3.11-slim

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y libpq-dev gcc


COPY requirements.txt /usr/src/app

RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt

COPY . .
ENV FLASK_DEBUG=True
EXPOSE 5000

ENTRYPOINT [ "flask"]
CMD [ "run", "--host", "0.0.0.0" ]