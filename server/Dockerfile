# Use official OpenJDK base image
FROM openjdk:17-jdk-slim

# Set environment variables
ENV PORT=8080

# Add metadata to image
LABEL maintainer="you@example.com"

# Create app directory inside container
WORKDIR /app

# Copy the built JAR file (built locally via Maven)
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Expose port (for Render, PORT is injected as env var)
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
