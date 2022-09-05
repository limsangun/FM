# #Build stage
# FROM openjdk:8-slim-buster as build

# COPY .mvn .mvn
# COPY mvnw .
# COPY pom.xml .

# # dependency 다운로드 캐싱.
# RUN chmod +x mvnw
# RUN ./mvnw -B dependency:go-offline                          

# # dependency 다운로드 후 src 추가.
# COPY src src

# RUN ./mvnw -B package -DskipTests                             

#Deploy stage
FROM openjdk:8-jre-slim-buster

WORKDIR ./app
#COPY --from=build target/*.jar ./app.jar
COPY target/*.jar ./app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
