#!/bin/sh

echo DEBUG=0 >> .env.prod
echo SQL_ENGINE=django.db.backends.postgresql >> .env.prod
echo DATABASE=postgres >> .env.prod

echo SECRET_KEY=$SECRET_KEY >> .env.prod
echo SQL_DATABASE=$SQL_DATABASE >> .env.prod
echo SQL_USER=$SQL_USER >> .env.prod
echo SQL_PASSWORD=$SQL_PASSWORD >> .env.prod
echo SQL_HOST=$SQL_HOST >> .env.prod
echo SQL_PORT=$SQL_PORT >> .env.prod

echo AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID >> .env.prod
echo AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY >> .env.prod
echo AWS_STORAGE_BUCKET_NAME=$AWS_STORAGE_BUCKET_NAME >> .env.prod
