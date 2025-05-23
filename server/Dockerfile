# ---- Build Stage ----
FROM openjdk:24-jdk AS build

# Set environment variables
ENV MAVEN_VERSION=3.9.4
ENV MAVEN_HOME=/opt/maven

# Install Maven
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://downloads.apache.org/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz | tar -xz -C /opt && \
    ln -s /opt/apache-maven-${MAVEN_VERSION} ${MAVEN_HOME} && \
    ln -s ${MAVEN_HOME}/bin/mvn /usr/bin/mvn

# Set working directory
WORKDIR /app

# Copy project files
COPY server/pom.xml .
COPY server/src ./src

# Build the application
RUN mvn clean package -DskipTests

# ---- Runtime Stage ----
FROM openjdk:24-jdk

# Set working directory
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/graphicalauth-0.0.1-SNAPSHOT.jar app.jar

# Expose application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

