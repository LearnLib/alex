package db.migration;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

public class V1_18__LtsFormulaSuites extends BaseJavaMigration {

    public void migrate(Context context) throws Exception {
        final Connection connection = context.getConnection();

        connection.createStatement().execute(""
                + "CREATE TABLE LTS_FORMULA_SUITE ("
                + "  ID BIGINT IDENTITY PRIMARY KEY,"
                + "  NAME VARCHAR(255) DEFAULT '',"
                + "  PROJECT_ID BIGINT NOT NULL,"
                + "  CONSTRAINT fkLtsFormulaSuiteProject FOREIGN KEY(PROJECT_ID) REFERENCES PROJECT,"
                + "  CONSTRAINT ltsFormulaSuiteUniqueNamePerProject UNIQUE(NAME, PROJECT_ID)"
                + ")");

        connection.createStatement().execute("ALTER TABLE LTS_FORMULA ADD COLUMN SUITE_ID BIGINT");

        createSuiteForExistingFormulas(connection);

        connection.createStatement().execute("ALTER TABLE LTS_FORMULA DROP COLUMN PROJECT_ID");
        connection.createStatement().execute("ALTER TABLE LTS_FORMULA ADD CONSTRAINT fkLtsFormulaLtsFormulaSuite FOREIGN KEY (SUITE_ID) REFERENCES LTS_FORMULA_SUITE");
    }

    private void createSuiteForExistingFormulas(Connection connection) throws SQLException {
        final ResultSet projects = connection.createStatement().executeQuery("SELECT ID FROM PROJECT");
        while (projects.next()) {
            final Long projectId = projects.getLong("ID");

            final ResultSet formulas = connection.createStatement().executeQuery("SELECT * FROM LTS_FORMULA WHERE PROJECT_ID = " + projectId);
            if (formulas.next()) {

                connection.createStatement().execute("INSERT INTO LTS_FORMULA_SUITE (NAME, PROJECT_ID) VALUES ('Default', " + projectId + ")");
                final ResultSet suite = connection.createStatement().executeQuery("SELECT ID FROM LTS_FORMULA_SUITE ORDER BY ID DESC LIMIT 1");
                suite.next();
                final Long suiteId = suite.getLong("ID");

                connection.createStatement().execute("UPDATE LTS_FORMULA SET SUITE_ID = " + suiteId + " WHERE PROJECT_ID = " + projectId);
            }
        }
    }
}