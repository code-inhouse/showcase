yarn install --frozen-lockfile
NODE_ENV=production yarn run build

gcloud --project ramen-223509 config set run/region us-central1
gcloud --project ramen-223509 builds submit --tag gcr.io/ramen-223509/calendar:latest
gcloud --project ramen-223509 beta run deploy calendar --image gcr.io/ramen-223509/calendar:latest
