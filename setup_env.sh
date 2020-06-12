#!/bin/sh

echo DEBUG=0 >> .env
echo DJANGO_ALLOWED_HOSTS=$EC2_PUBLIC_IP_ADDRESS >> .env
echo SQL_ENGINE=django.db.backends.postgresql >> .env
echo DATABASE=postgres >> .env

echo SECRET_KEY=$SECRET_KEY >> .env
echo SQL_DATABASE=$SQL_DATABASE >> .env
echo SQL_USER=$SQL_USER >> .env
echo SQL_PASSWORD=$SQL_PASSWORD >> .env
echo SQL_HOST=$SQL_HOST >> .env
echo SQL_PORT=$SQL_PORT >> .env

echo AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID >> .env
echo AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY >> .env
echo AWS_STORAGE_BUCKET_NAME=$AWS_STORAGE_BUCKET_NAME >> .env

echo API_IMAGE=$IMAGE:api  >> .env
echo NGINX_IMAGE=$IMAGE:nginx  >> .env
echo CI_REGISTRY_USER=$CI_REGISTRY_USER   >> .env
echo CI_JOB_TOKEN=$CI_JOB_TOKEN  >> .env
echo CI_REGISTRY=$CI_REGISTRY  >> .env
echo IMAGE=$CI_REGISTRY/$CI_PROJECT_NAMESPACE/$CI_PROJECT_NAME >> .env