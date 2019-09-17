package db.migration;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

public class V1_3__Environments extends BaseJavaMigration {
    public void migrate(Context context) throws Exception {
        final Connection connection = context.getConnection();

        // urlId -> envId
        final Map<Long, Long> urlToEnvMap = new HashMap<>();
        final Map<Long, Long> projectToEnvMap = new HashMap<>();

        final ResultSet projectRows = connection.createStatement().executeQuery("SELECT ID FROM PUBLIC.PROJECT ORDER BY ID");
        while (projectRows.next()) {
            final long projectId = projectRows.getLong(1);

            // create environment for each project url
            long i = 0L;
            final ResultSet urlRows = connection.createStatement().executeQuery("SELECT ID, NAME, IS_DEFAULT, URL FROM PUBLIC.PROJECT_URL ORDER BY ID");
            while (urlRows.next()) {
                String name = urlRows.getString(2);
                name = name == null ? "Production" + (i++) : name;
                final boolean isDefault = urlRows.getBoolean(3);
                final long urlId = urlRows.getLong(1);
                connection.createStatement().execute("INSERT INTO PUBLIC.PROJECT_ENVIRONMENT (NAME, PROJECT_ID, IS_DEFAULT) VALUES ('" + name + "', " + projectId + ", " + isDefault + ")");

                // set environment_id to project_url
                final ResultSet lastEnvRow = connection.createStatement().executeQuery("SELECT ID FROM PUBLIC.PROJECT_ENVIRONMENT ORDER BY ID DESC LIMIT 1");
                while (urlRows.next()) {
                    final long envId = lastEnvRow.getLong(1);

                    urlToEnvMap.put(urlId, envId);
                    projectToEnvMap.putIfAbsent(projectId, envId);

                    connection.createStatement().executeUpdate("UPDATE PUBLIC.PROJECT_URL SET ENVIRONMENT_ID = " + envId + " WHERE ID = " + urlId);
                    break;
                }
            }
        }

        // remove columns
        connection.createStatement().executeUpdate("ALTER TABLE PUBLIC.PROJECT_URL DROP COLUMN PROJECT_ID");

        // update test configs
        final ResultSet testConfigRows = connection.createStatement().executeQuery("SELECT ID, URL_ID FROM PUBLIC.TEST_EXECUTION_CONFIG");
        while (testConfigRows.next()) {
            final long id = testConfigRows.getLong(1);
            final long urlId = testConfigRows.getLong(2);
            connection.createStatement().executeUpdate("UPDATE PUBLIC.TEST_EXECUTION_CONFIG SET ENVIRONMENT_ID = " + urlToEnvMap.get(urlId) + " WHERE ID = " + id);
        }
        connection.createStatement().executeUpdate("ALTER TABLE PUBLIC.TEST_EXECUTION_CONFIG DROP COLUMN URL_ID");

        // set environments for existing test reports
        final ResultSet testReportRows = connection.createStatement().executeQuery("SELECT ID, PROJECT_ID FROM PUBLIC.TEST_REPORT");
        while (testConfigRows.next()) {
            final long id = testReportRows.getLong(1);
            final long projectId = testReportRows.getLong(2);
            connection.createStatement().executeUpdate("UPDATE PUBLIC.TEST_REPORT SET ENVIRONMENT_ID = " + projectToEnvMap.get(projectId) + " WHERE ID = " + id);
        }

        // replace urls with environment in learner results
        final ResultSet learnerResultRows = connection.createStatement().executeQuery("SELECT LEARNER_RESULT_ID, URLS_ID FROM PUBLIC.LEARNER_RESULT_URLS");
        while (learnerResultRows.next()) {
            final long resultId = learnerResultRows.getLong(1);
            final long urlId = learnerResultRows.getLong(2);
            final long envId = urlToEnvMap.get(urlId);

            connection.createStatement().execute("INSERT INTO PUBLIC.LEARNER_RESULT_ENVIRONMENTS (LEARNER_RESULT_ID, ENVIRONMENTS_ID) VALUES (" + resultId + ", " + envId + ")");
        }

        // remove learner result urls
        connection.createStatement().executeUpdate("DROP TABLE LEARNER_RESULT_URLS");
    }
}
