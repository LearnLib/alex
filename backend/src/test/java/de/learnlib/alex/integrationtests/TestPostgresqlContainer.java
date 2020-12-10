package de.learnlib.alex.integrationtests;

import org.testcontainers.containers.PostgreSQLContainer;

public class TestPostgresqlContainer extends PostgreSQLContainer<TestPostgresqlContainer> {
    private static final String IMAGE_VERSION = "postgres:10.1";
    private static TestPostgresqlContainer container;

    private TestPostgresqlContainer() {
        super(IMAGE_VERSION);
    }

    public static TestPostgresqlContainer getInstance() {
        if (container == null) {
            container = new TestPostgresqlContainer();
        }
        return container;
    }

    @Override
    public void start() {
        super.start();
        System.setProperty("DB_URL", container.getJdbcUrl());
        System.setProperty("DB_USERNAME", container.getUsername());
        System.setProperty("DB_PASSWORD", container.getPassword());
    }

    @Override
    public void stop() {
    }
}