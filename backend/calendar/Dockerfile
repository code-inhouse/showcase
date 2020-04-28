FROM python:3.7-alpine

RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev
RUN pip install -U pip pipenv
WORKDIR /project

COPY Pipfile /project/Pipfile
COPY Pipfile.lock /project/Pipfile.lock

RUN pipenv install --deploy --system

COPY . /project

ENV APP_MODE=prod

RUN python manage.py collectstatic --noinput

CMD gunicorn -w 5 -b 0.0.0.0:$PORT --access-logfile - --error-logfile - --log-file - --log-level info --timeout 90 core.wsgi:application
