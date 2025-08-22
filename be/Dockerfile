# Use the official .NET SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the project file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the application source code
COPY . ./

# Install EF Core tool for migrations during build
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# Build the application
RUN dotnet publish -c Release -o out

# Run migrations during build (optional - comment out if you want to run manually)
# RUN dotnet ef database update --connection "Server=sqlserver,1433;Database=BookingHotelDB;User Id=sa;Password=BookingHotel123!;TrustServerCertificate=true;MultipleActiveResultSets=true"

# Use the official .NET runtime image for running the app
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

# Install packages needed for health checks
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy the published app from the build stage
COPY --from=build /app/out .

# Copy the entrypoint script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Expose the port the app runs on
EXPOSE 8080

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_RUNNING_IN_CONTAINER=true

# Start the application with entrypoint script
ENTRYPOINT ["./entrypoint.sh"]