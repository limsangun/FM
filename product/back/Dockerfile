FROM openjdk:8-jre-slim-buster

WORKDIR ./app

COPY ./*.jar ./app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
