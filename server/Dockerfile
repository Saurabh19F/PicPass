# ---- Stage 1: Build with Java 17 and Maven ----
FROM maven:3.9.4-eclipse-temurin-17 AS build

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# ---- Stage 2: Run with Java 24 ----
FROM openjdk:24-jdk
WORKDIR /app

COPY --from=build /app/target/graphicalauth-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

