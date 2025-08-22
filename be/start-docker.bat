@echo off
echo Building and starting BookingHotel application with Docker...

echo.
echo Stopping any existing containers...
docker-compose down

echo.
echo Building Docker images...
docker-compose build --no-cache

echo.
echo Starting SQL Server...
docker-compose up -d sqlserver

echo.
echo Waiting for SQL Server to be ready...
timeout /t 20

echo.
echo Running database migrations...
docker-compose up migration

echo.
echo Starting API service...
docker-compose up -d api

echo.
echo Waiting for services to start...
timeout /t 10

echo.
echo Services started successfully!
echo API is available at: http://localhost:5245
echo Swagger UI: http://localhost:5245/swagger
echo SQL Server is available at: localhost:1433
echo.
echo To view logs: docker-compose logs -f api
echo To stop services: docker-compose down
echo.

pause
