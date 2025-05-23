# ---- Build Stage ----
FROM openjdk:24-jdk AS build

# Install Maven manually
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://downloads.apache.org/maven/maven-3/3.9.4/binaries/apache-maven-3.9.4-bin.tar.gz | tar -xz -C /opt && \
    ln -s /opt/apache-maven-3.9.4 /opt/maven && \
    ln -s /opt/maven/bin/mvn /usr/bin/mvn

ENV MAVEN_HOME=/opt/maven

WORKDIR /app

# ✅ FIXED: point to server/ from root context
COPY server/pom.xml ./pom.xml
COPY server/src ./src

RUN mvn clean package -DskipTests

# ---- Runtime Stage ----
FROM openjdk:24-jdk
WORKDIR /app
COPY --from=build /app/target/graphicalauth-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
