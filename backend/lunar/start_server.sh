docker run \
    -e APP_ENV=stage \

    lunar:latest \
    python manage.py migrate


docker run \
    -d \
    --restart=always \
    -e APP_ENV=stage \
    -e PORT=<value>
    -e GOOGLE_OAUTH2_KEY=<value> \
    -e GOOGLE_OAUTH2_SECRET=<value> \
    -e FACEBOOK_KEY=<value> \
    -e FACEBOOK_SECRET=<value> \
    -e AUTH_TWITTER_KEY=<value> \
    -e AUTH_TWITTER_SECRET=<value> \
    -e SENDGRID_USER=<value> \
    -e SENDGRID_PASS=<value> \
    -e SECRET_KEY=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa \
    -e DB_NAME=lunar \
    -e DB_USER=root \
    -e DB_HOST=<value> \
    -e EMAIL_SENDER=<value> \
    -e HOST=<value> \
    -p <external_port>:<internal_port> \
    lunar:latest
