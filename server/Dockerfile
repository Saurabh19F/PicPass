# ---- Stage 1: Build the application ----
FROM maven:3.9.4-eclipse-temurin-17 AS build

# Set working directory inside the container
WORKDIR /app

# Copy pom.xml and download dependencies (cached separately for speed)
COPY server/pom.xml ./server/
RUN mvn -f server/pom.xml dependency:go-offline

# Copy the full source code into the container
COPY server ./server

# Build the application (skip tests for faster build)
RUN mvn -f server/pom.xml clean package -DskipTests

# ---- Stage 2: Run the application ----
FROM eclipse-temurin:17-jdk AS runtime

# Set working directory
WORKDIR /app

# Copy the Spring Boot jar from the build stage
COPY --from=build /app/server/target/graphicalauth-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port (change if needed)
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]

