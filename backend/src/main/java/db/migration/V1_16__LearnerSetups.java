package db.migration;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;

import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class V1_16__LearnerSetups extends BaseJavaMigration {

    public void migrate(Context context) throws Exception {
        final Connection connection = context.getConnection();

        connection.createStatement().execute(""
                + "CREATE TABLE LEARNER_SETUP ("
                + "   ID                    BIGINT IDENTITY NOT NULL,"
                + "   PROJECT_ID            BIGINT NOT NULL,"
                + "   NAME                  VARCHAR(255) DEFAULT '',"
                + "   ENABLE_CACHE          BOOLEAN NOT NULL,"
                + "   PRE_SYMBOL_ID         BIGINT NOT NULL,"
                + "   POST_SYMBOL_ID        BIGINT,"
                + "   ALGORITHM             VARBINARY(255) NOT NULL,"
                + "   EQUIVALENCE_ORACLE    BLOB NOT NULL,"
                + "   WEB_DRIVER_ID         BIGINT NOT NULL,"
                + "   SAVED                 BOOLEAN DEFAULT FALSE,"
                + "   PRIMARY KEY(ID), "
                + "   CONSTRAINT FK_LEARNER_SETUP_PROJECT FOREIGN KEY (PROJECT_ID) REFERENCES PUBLIC.PROJECT,"
                + "   CONSTRAINT FK_LEARNER_SETUP_PRE_SYMBOL FOREIGN KEY (PRE_SYMBOL_ID) REFERENCES PUBLIC.PARAMETERIZED_SYMBOL,"
                + "   CONSTRAINT FK_LEARNER_SETUP_POST_SYMBOL FOREIGN KEY (POST_SYMBOL_ID) REFERENCES PUBLIC.PARAMETERIZED_SYMBOL,"
                + "   CONSTRAINT FK_LEARNER_SETUP_WEB_DRIVER FOREIGN KEY (WEB_DRIVER_ID) REFERENCES PUBLIC.ABSTRACT_WEB_DRIVER_CONFIG"
                + ")");

        connection.createStatement().execute(""
                + "CREATE TABLE LEARNER_SETUP_SYMBOLS ("
                + "   LEARNER_SETUP_ID  BIGINT NOT NULL,"
                + "   SYMBOLS_ID        BIGINT NOT NULL,"
                + "   CONSTRAINT FK_LEARNER_SETUP_SYMBOLS_SETUP FOREIGN KEY (LEARNER_SETUP_ID) REFERENCES PUBLIC.LEARNER_SETUP,"
                + "   CONSTRAINT FK_LEARNER_SETUP_SYMBOLS_SYMBOL FOREIGN KEY (SYMBOLS_ID) REFERENCES PUBLIC.PARAMETERIZED_SYMBOL"
                + ")");

        connection.createStatement().execute(""
                + "CREATE TABLE LEARNER_SETUP_ENVIRONMENTS ("
                + "   LEARNER_SETUP_ID   BIGINT NOT NULL,"
                + "   ENVIRONMENTS_ID    BIGINT NOT NULL,"
                + "   CONSTRAINT FK_LEARNER_SETUP_ENVIRONMENTS_SETUP FOREIGN KEY (LEARNER_SETUP_ID) REFERENCES PUBLIC.LEARNER_SETUP,"
                + "   CONSTRAINT FK_LEARNER_SETUP_ENVIRONMENTS_ENVIRONMENT FOREIGN KEY (ENVIRONMENTS_ID) REFERENCES PUBLIC.PROJECT_ENVIRONMENT"
                + ")");

        connection.createStatement().execute("ALTER TABLE LEARNER_RESULT ADD COLUMN SETUP_ID BIGINT");
        connection.createStatement().execute("ALTER TABLE LEARNER_RESULT ADD CONSTRAINT FK_LEARNER_RESULT_LEARNER_SETUP FOREIGN KEY (SETUP_ID) REFERENCES PUBLIC.LEARNER_SETUP");
        connection.commit();

        migrateLearnerResultsToLearnerSetups(connection);
        connection.commit();

        connection.createStatement().execute("ALTER TABLE LEARNER_RESULT DROP COLUMN ALGORITHM;");
        connection.createStatement().execute("ALTER TABLE LEARNER_RESULT DROP COLUMN USEMQCACHE;");
        connection.createStatement().execute("ALTER TABLE LEARNER_RESULT DROP COLUMN DRIVER_CONFIG_ID;");
        connection.createStatement().execute("ALTER TABLE LEARNER_RESULT DROP COLUMN POST_SYMBOL_ID;");
        connection.createStatement().execute("ALTER TABLE LEARNER_RESULT DROP COLUMN RESET_SYMBOL_ID;");
        connection.createStatement().execute("DROP TABLE LEARNER_RESULT_ENVIRONMENTS;");
        connection.createStatement().execute("DROP TABLE LEARNER_RESULT_SYMBOLS;");
    }

    private void migrateLearnerResultsToLearnerSetups(final Connection connection) throws Exception {
        final ResultSet learnerResult = connection.createStatement().executeQuery("SELECT ID, PROJECT_ID, ALGORITHM, COMMENT, USEMQCACHE, DRIVER_CONFIG_ID, POST_SYMBOL_ID, RESET_SYMBOL_ID FROM LEARNER_RESULT");
        while(learnerResult.next()) {
            final Long resultId = learnerResult.getLong("ID");

            final ResultSet firstResultStep = connection.createStatement().executeQuery("SELECT EQ_ORACLE FROM LEARNER_RESULT_STEP WHERE RESULT_ID = " + resultId + " ORDER BY STEP_NO LIMIT 1");
            firstResultStep.next();

            final PreparedStatement stmt = connection.prepareStatement(""
                    + "INSERT INTO LEARNER_SETUP ("
                    + "PROJECT_ID, "
                    + "NAME, "
                    + "ENABLE_CACHE, "
                    + "PRE_SYMBOL_ID, "
                    + "POST_SYMBOL_ID, "
                    + "ALGORITHM, "
                    + "EQUIVALENCE_ORACLE, "
                    + "WEB_DRIVER_ID, "
                    + "SAVED"
                    + ") VALUES ("
                    + learnerResult.getLong("PROJECT_ID") +", "
                    + learnerResult.getString("COMMENT") + ", "
                    + learnerResult.getBoolean("USEMQCACHE") + ", "
                    + learnerResult.getLong("RESET_SYMBOL_ID") + ", "
                    + learnerResult.getString("POST_SYMBOL_ID") + ", "
                    + "?, "
                    + "?, "
                    + learnerResult.getLong("DRIVER_CONFIG_ID") +", "
                    + false + ")");

            stmt.setBlob(1, learnerResult.getBlob("ALGORITHM"));
            stmt.setBlob(2, firstResultStep.getBlob("EQ_ORACLE"));
            stmt.execute();

            final ResultSet createdSetup = connection.createStatement().executeQuery("SELECT ID FROM LEARNER_SETUP ORDER BY ID DESC LIMIT 1");
            createdSetup.next();

            final Long setupId = createdSetup.getLong("ID");
            connection.createStatement().execute("UPDATE LEARNER_RESULT SET SETUP_ID = " + setupId + " WHERE ID = " + resultId);

            final ResultSet learnerResultSymbol = connection.createStatement().executeQuery("SELECT SYMBOLS_ID FROM LEARNER_RESULT_SYMBOLS WHERE LEARNER_RESULT_ID = " + resultId);
            while (learnerResultSymbol.next()) {
                connection.createStatement().execute("INSERT INTO LEARNER_SETUP_SYMBOLS (LEARNER_SETUP_ID, SYMBOLS_ID) VALUES (" + setupId + ", " + learnerResultSymbol.getString("SYMBOLS_ID") + ");");
            }

            final ResultSet learnerResultEnvironments = connection.createStatement().executeQuery("SELECT ENVIRONMENTS_ID FROM LEARNER_RESULT_ENVIRONMENTS WHERE LEARNER_RESULT_ID = " + resultId);
            while (learnerResultEnvironments.next()) {
                connection.createStatement().execute("INSERT INTO LEARNER_SETUP_ENVIRONMENTS (LEARNER_SETUP_ID, ENVIRONMENTS_ID) VALUES (" + setupId + ", " + learnerResultEnvironments.getString("ENVIRONMENTS_ID") + ");");
            }
        }
    }
}
