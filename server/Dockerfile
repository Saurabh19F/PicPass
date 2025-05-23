# ---- Build Stage ----
FROM maven:3.9.4-openjdk-24 AS build
WORKDIR /app
COPY server/pom.xml ./server/
RUN mvn -f server/pom.xml dependency:go-offline
COPY server ./server
RUN mvn -f server/pom.xml clean package -DskipTests

# ---- Runtime Stage ----
FROM openjdk:24-ea-slim
WORKDIR /app
COPY --from=build /app/server/target/graphicalauth-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
