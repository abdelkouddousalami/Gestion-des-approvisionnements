FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
COPY gestion-stock/pom.xml .
RUN mvn dependency:go-offline
COPY gestion-stock/src ./src
RUN mvn clean package -Dmaven.test.skip=true

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.war app.war
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.war"]
