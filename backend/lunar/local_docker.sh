docker build . -t lunar:latest
docker run \
    -d \
    -e APP_ENV=stage \
    -e GOOGLE_OAUTH2_KEY='320395926432-c9t43a39u1eqhpghsu44hguargitictr.apps.googleusercontent.com' \
    -e GOOGLE_OAUTH2_SECRET='UQO7t8Pre3gvFGmCm5oLJroC' \
    -e FACEBOOK_KEY='630303024135186' \
    -e FACEBOOK_SECRET='9287e0aa5c3cd4c48f8a203cfb778e61' \
    -e AUTH_TWITTER_KEY='yIpdv0U08WMEG672O32BH6OML' \
    -e AUTH_TWITTER_SECRET='QRzzFstoSO7OVh17On53WTUbi2ysseyGeBZFGs7sxPBg60ixzs' \
    -e SENDGRID_USER=\
    -e SENDGRID_PASS=\
    -e DB_NAME='lunar-stage' \
    -e DB_USER='postgres' \
    -e DB_PASSWORD='cjhVCJwXju7RNfnQDdT4vdX6' \
    -e DB_HOST='104.196.209.128' \
    -p 6666:8080 \
    lunar:latest \
    sh start_server.sh
