FROM python:3.7-alpine

WORKDIR /project

RUN apk update && \
    apk add --virtual build-deps && \
    apk add gcc nginx nodejs mariadb-connector-c mariadb-dev nodejs-npm python3-dev musl-dev

RUN pip install --upgrade pip
RUN pip install pipenv

COPY Pipfile /project
COPY Pipfile.lock /project

RUN pipenv install --system --deploy

COPY . /project

RUN npm config set unsafe-perm true
RUN npm i -g yarn
RUN rm -rf node_modules
RUN yarn
RUN yarn build

CMD gunicorn -w 5 -b 0.0.0.0:$PORT \
             --access-logfile - \
             --error-logfile - \
             --log-file - \
             --log-level info \
             --timeout 300 \
             core.wsgi:application
