#!/bin/bash

echo "Stopping jenkins..."
docker stop vrbeneficios-jenkins

echo "Removing previous container..."
docker rm vrbeneficios-jenkins

echo "Running docker container"
docker run --name vrbeneficios-jenkins -d -p 8080:8080 -t vrbeneficios/jenkins
