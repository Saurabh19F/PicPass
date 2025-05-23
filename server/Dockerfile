# ---- Stage 1: Build with Java 24 ----
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

WORKDIR /app

# Copy pom.xml and fetch dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the Spring Boot app
RUN mvn clean package -DskipTests

# ---- Stage 2: Runtime with Java 24 ----
FROM openjdk:24-jdk
WORKDIR /app

COPY --from=build /app/target/graphicalauth-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
