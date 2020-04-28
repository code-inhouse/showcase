## database setup

```
sudo su - postgres
psql
create database dating;
create user datingadmin with password '3m0eqhbtru';
alter role datingadmin set client_encoding to 'utf8';
alter role datingadmin set default_transaction_isolation to 'read committed';
alter role datingadmin set timezone to 'UTC';
grant all privileges on database dating to datingadmin;
grant all privileges on database test_dating to datingadmin;
alter user datingadmin createdb;
\q
exit

```

## hosting

[follow this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-16-04)

Do not forget to add gzip_static option for local files

Do not forget to change `user` to `root` in `nginx.conf`

[celery](http://michal.karzynski.pl/blog/2014/05/18/setting-up-an-asynchronous-task-queue-for-django-using-celery-redis/)

## update all requirements
```
make setup
```

## async tasks
[tutorial](https://realpython.com/blog/python/asynchronous-tasks-with-django-and-celery/)

do not forget to install redis first

run these commands in separate terminals
```
redis-server
make celery-worker
make celery-beat
```
