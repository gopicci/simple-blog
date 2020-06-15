### simple-blog
CRUD app with a CI/CD pipeline set up through GitLab deployed on AWS [here](http://ec2-35-161-201-46.us-west-2.compute.amazonaws.com/ "simple-blog").


It has been developed with a test driven approach. The backend API is written with Django REST framework and is still reachable from the outside, see swagger docs [here](http://ec2-35-161-201-46.us-west-2.compute.amazonaws.com/api/docs/ "simple-blog Swagger docs"). It uses session authentication and allows basic CRUD operations. The frontend uses React Bootstrap and requires a modnern browser.

It was developed in a local environment using 4 Docker containers:

  * API - Django REST Framework
  * UI - React
  * Web server - Nginx
  * Database - Postgres


It's deployed on AWS in an EC2 instance with 2 Docker containers, the API one and the NGINX one which also serves the React build. Django static files and images are in an S3 instance.


The CI/CD pipeline goes through 3 stages:

  * build - builds the 2 final images
  * test - builds an extra temporary Postgres image to run tests on the API
  * deploy - pushes the 2 final images to EC2


The GitLab repository is public and available [here](https://gitlab.com/gopicci/simple-blog "simple-blog GitLab repository").
