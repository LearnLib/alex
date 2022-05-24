# ALEX as dependency

You can use the `backend` module of ALEX as a dependency in other Maven projects.

1. Add the sonatype snapshot repository to your `pom.xml`:

    ```xml
    <repositories>
      <!-- other repositories -->

      <repository>
        <id>sonatype-nexus-snapshots</id>
        <name>Sonatype Nexus Snapshots</name>
        <url>https://oss.sonatype.org/content/repositories/snapshots</url>
      </repository>
    </repositories>
    ```

2. Add ALEX as Maven dependency in your `pom.xml`:

    ```xml
    <dependencies>
      <!-- other dependencies -->

      <dependency>
        <groupId>de.learnlib.alex</groupId>
        <artifactId>alex-backend</artifactId>
        <version>3.0.0</version>
      </dependency>
    </dependencies>
    ```

    If you are using a **Spring-Boot** app, exclude all related dependencies from the ALEX dependency:

    ```xml
    <dependencies>
      <!-- other dependencies -->

      <dependency>
        <groupId>de.learnlib.alex</groupId>
        <artifactId>alex-backend</artifactId>
        <version>3.0.0</version>

         <!-- exclude dependencies from Spring-Boot if you are using ALEX within another Spring-Boot app -->
         <exclusions>
           <exclusion>
             <groupId>org.springframework.boot</groupId>
             <artifactId>*</artifactId>
           </exclusion>
         </exclusions>
      </dependency>
    </dependencies>
    ```
