settings = DJANGO_SETTINGS_MODULE=dating.settings.base

start:
	$(settings) python src/manage.py runserver

prod:
	$(settings) python src/manage.py runserver

makemigrations:
	$(settings) python src/manage.py makemigrations activities chats configurations dateprofile likes payments feedbacks news loginfo achievements moderator_panel

migrate:
	$(settings) python src/manage.py migrate

gunicorn:
	gunicorn --env $(settings) dating.wsgi

gunicorn_prod:
	gunicorn --env DJANGO_SETTINGS_MODULE=dating.settings.prod dating.wsgi

createsuperuser:
	$(settings) python src/manage.py createsuperuser

test:
	$(settings) python src/manage.py test src/

shell:
	$(settings) python src/manage.py shell

setup:
	if [ ! -f geoip/GeoLite2-City.mmdb ]; then wget --directory-prefix=geoip http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz && gunzip geoip/GeoLite2-City.mmdb.gz; fi;
	pip install -r requirements/base.txt
	make makemigrations
	make migrate
	make compilemessages
	npm i --dev
	npm run build
	bower install --allow-root

celery-worker:
	$(settings) celery --workdir=src/ -A dating worker -l info

celery-beat:
	$(settings) celery --workdir=src/ -A dating beat -l info

wsserver:
	python src/chats/ws_server.py

loadip:
	$(settings) python src/manage.py loadip ${cities} ${ips}

sendmail:
	DJANGO_SETTINGS_MODULE=dating.settings.prod python src/manage.py sendmail ${email} ${letter}

makemessages:
	$(settings) python src/manage.py makemessages -l en

compilemessages:
	$(settings) python src/manage.py compilemessages -l en
