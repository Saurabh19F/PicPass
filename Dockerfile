# ---- Stage 1: Build the application with Java 24 and Maven manually installed ----
FROM openjdk:24-jdk AS build

# Install Maven manually
ENV MAVEN_VERSION=3.9.4
ENV MAVEN_HOME=/opt/maven

RUN apt-get update && \
    apt-get install -y curl unzip && \
    curl -fsSL https://downloads.apache.org/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
    | tar -xz -C /opt && \
    ln -s /opt/apache-maven-${MAVEN_VERSION} ${MAVEN_HOME} && \
    ln -s ${MAVEN_HOME}/bin/mvn /usr/bin/mvn

# Set working directory
WORKDIR /app

# Copy only pom.xml to cache dependencies first
COPY server/pom.xml ./pom.xml
RUN mvn dependency:go-offline

# Copy full project source
COPY server/src ./src

# Build the Spring Boot application
RUN mvn clean package -DskipTests

# ---- Stage 2: Run the compiled Spring Boot app ----
FROM openjdk:24-jdk
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/graphicalauth-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
