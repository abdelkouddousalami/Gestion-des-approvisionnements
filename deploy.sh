#!/bin/bash

set -e

echo "=== Gestion Stock Tricol - Deployment Script ==="

echo "Step 1: Building application..."
cd gestion-stock
mvn clean package -DskipTests
cd ..

echo "Step 2: Building Docker image..."
docker build -t gestion-stock:latest .

echo "Step 3: Starting infrastructure..."
docker-compose down -v
docker-compose up -d mysql

echo "Waiting for MySQL to be ready..."
sleep 30

echo "Step 4: Starting Keycloak..."
docker-compose up -d keycloak

echo "Waiting for Keycloak to be ready..."
sleep 60

echo "Step 5: Configuring Keycloak..."
./setup-keycloak.sh

echo "Step 6: Starting application..."
docker-compose up -d app

echo "Step 7: Starting SonarQube and Jenkins..."
docker-compose up -d sonarqube jenkins

echo "=== Deployment completed ==="
echo "Application: http://localhost:8080"
echo "Keycloak: http://localhost:8180"
echo "SonarQube: http://localhost:9000"
echo "Jenkins: http://localhost:8081"
echo "Swagger: http://localhost:8080/swagger-ui.html"
