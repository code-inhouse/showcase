# Deploy

```
ssh prod-calendar
sudo -i
cd /var/www/calendar/
git pull
NODE_ENV=production yarn run build
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate
```
