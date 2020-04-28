# Deployment

The application is dockerized.

To build the docker image run

```
docker build . -t <image>:<tag>
```

To run the docker image run

```
docker run \
    -d \
    --restart=always \
    -e APP_ENV=stage \
    -e PORT=<value> \
    -e GOOGLE_OAUTH2_KEY=<value> \
    -e GOOGLE_OAUTH2_SECRET=<value> \
    -e FACEBOOK_KEY=<value> \
    -e FACEBOOK_SECRET=<value> \
    -e AUTH_TWITTER_KEY=<value> \
    -e AUTH_TWITTER_SECRET=<value> \
    -e SENDGRID_USER=<value> \
    -e SENDGRID_PASS=<value> \
    -e SECRET_KEY=<value> \
    -e DB_NAME=<value> \
    -e DB_USER=<value>' \
    -e DB_PASSWORD=<value> \
    -e DB_HOST=<value> \
    -e EMAIL_SENDER=<value> \
    -e HOST=<value> \
    -p <external_port>:<internal_port> \
    lunar:latest
```

To run migrations on a database run

```
docker run \
    -e APP_ENV=stage \
    -e SECRET_KEY=<value> \
    -e DB_NAME=<value> \
    -e DB_USER=<value>' \
    -e DB_PASSWORD=<value> \
    -e DB_HOST=<value> \
    lunar:latest \
    python manage.py migrate
```

Make sure that
0. You replace `<value>` with appropriate values for each of the variables.
1. `APP_ENV` is set to `stage`. It will make application run in debug mode.
2. `-p` option is synced with `PORT` variable. `PORT` is the variable that defines which port application uses inside docker, it must be the same as `internal_port` in `-p` flag. `external_port` in `-p` flag is the value you can use to route traffic to that port. For example, if you want the application to be served at port 3000 you can set `PORT` to be equal to `3000` and `-p` to be `3000:3000`.

Environment variables are described below.

## Third party services

### Sendgrid

We rely on sendgrid to send emails. We send emails via SMTP over 587 port. If you want to use another provider and that provider supports this way of email sending, you can replace `SENDGRID_USER` and `SENDGRID_PASS` variables with the one of your email provider.

### Google Storage

We use Google Storage to store user's avatars. You have to set up a variable `GOOGLE_CREDENTIALS_PATH` that will point to .json file with Google Cloud IAM credentialss. These credentials must have access to read and write objects to `MEDIA_BUCKET`. You can mount a volume to the container with the required file.

If run in the debug mode it will use stage bucket (lunar-dev).

### Oauth

We use Facebook, Twitter, Google as OAuth providers for the application.

#### Facebook

Make sure to add your application's domain to the facebook app.

#### Twitter

Set callback URL in twitter application to be http://{your_domain}/complete/twitter/

## Env vars

You must supply these env variables to the container in order for it to operate.

* `APP_ENV` - must be set to "prod"
* `PORT` - port that the application will use to serve itself
* `GOOGLE_OAUTH2_KEY` - Google OAuth key
* `GOOGLE_OAUTH2_SECRET` - Google OAuth secet
* `FACEBOOK_KEY` - Facebook OAuth key
* `FACEBOOK_SECRET` - Facebook OAuth secret
* `AUTH_TWITTER_KEY` - Twitter OAuth key
* `AUTH_TWITTER_SECRET` - Twitter OAuth secret
* `SENDGRID_USER` - Sendgrid user
* `SENDGRID_PASS` - Sendgrid password
* `EMAIL_SENDER` - email sender in form name@domain.com. Make sure that domain is verified in sendgrid (or your email provider)
* `SECRET_KEY` - Django's secret key, must be 32-characters long random string
* `DB_NAME` - Database Name (mysql)
* `DB_USER` - Database User (mysql)
* `DB_PASSWORD` - Database Password (mysql)
* `DB_HOST` - Database Host (mysql)
* `MEDIA_BUCKET` - Name of Google Cloud Storage bucket that avatars will be stored to
* `GOOGLE_CREDENTIALS_PATH` - path inside the container to the file with credentials.
* `HOST` - application's host. Must be in the for "https://myapp.com"
