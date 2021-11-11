# ALEX as dependency

You can use the `backend` module of ALEX as a dependency in other Maven projects.

1. Execute `mvn clean package -DskipTests` in the `backend` directory.
2. In the `backend/target` directory, a jar file with the suffix `jar-with-dependencies.jar` is generated.
3. Include this package into your Maven projects.
