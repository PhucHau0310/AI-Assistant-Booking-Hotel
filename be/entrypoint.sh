#!/bin/bash

echo "Environment variables:"
echo "CONNECTION_STRING: $CONNECTION_STRING"
echo "JWT_KEY: [HIDDEN]"
echo "JWT_ISSUER: $JWT_ISSUER"
echo "JWT_AUDIENCE: $JWT_AUDIENCE"

echo "Starting BookingHotel API..."
exec dotnet be.dll
