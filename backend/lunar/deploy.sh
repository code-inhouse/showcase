yarn
NODE_ENV=production yarn run build
docker build . -t  gcr.io/ramen-223509/lunar:latest
docker push gcr.io/ramen-223509/lunar:latest

gcloud --project ramen-223509 config set run/region us-central1
gcloud --project ramen-223509 beta run deploy lunar --image gcr.io/ramen-223509/lunar:latest
