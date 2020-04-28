yarn install --frozen-lockfile
NODE_ENV=production yarn run build

gcloud --project suzume config set run/region us-central1
gcloud --project suzume builds submit --tag gcr.io/suzume/calendar:latest
gcloud --project suzume beta run deploy calendar --image gcr.io/suzume/calendar:latest --platform managed
curl https://itiner.io/run_migrations/
