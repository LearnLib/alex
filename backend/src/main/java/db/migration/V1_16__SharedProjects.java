package db.migration;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;

import java.sql.Connection;
import java.sql.ResultSet;

public class V1_16__SharedProjects extends BaseJavaMigration {
    public void migrate(Context context) throws Exception {
        final Connection connection = context.getConnection();

        //create join tables
        connection.createStatement().execute("CREATE TABLE PUBLIC.PROJECT_MEMBERS (PROJECT_ID bigint NOT NULL, USER_ID bigint NOT NULL, " +
                                                "CONSTRAINT fk_project_members_user_id FOREIGN KEY (USER_ID) REFERENCES PUBLIC.USER, " +
                                                "CONSTRAINT fk_project_members_project_id FOREIGN KEY (PROJECT_ID) REFERENCES PUBLIC.PROJECT, " +
                                                "CONSTRAINT unique_project_member_relation UNIQUE (USER_ID, PROJECT_ID))");

        connection.createStatement().execute("CREATE TABLE PUBLIC.PROJECT_OWNERS (PROJECT_ID bigint NOT NULL, USER_ID bigint NOT NULL, " +
                                                "CONSTRAINT fk_project_owners_user_id FOREIGN KEY (USER_ID) REFERENCES PUBLIC.USER," +
                                                "CONSTRAINT fk_project_owners_project_id FOREIGN KEY (PROJECT_ID) REFERENCES PUBLIC.PROJECT, " +
                                                "CONSTRAINT unique_project_owner_relation UNIQUE (USER_ID, PROJECT_ID))");

        //populate owners
        final ResultSet projectRows = connection.createStatement().executeQuery("SELECT ID FROM PUBLIC.PROJECT ORDER BY ID");
        while (projectRows.next()) {
            final long projectId = projectRows.getLong(1);
            final long userId = projectRows.getLong(4);

            connection.createStatement().executeUpdate("INSERT INTO PUBLIC.PROJECT_OWNERS (PROJECT_ID, USER_ID) VALUES (" + projectId + ", " + userId + ")");
        }

        //drop constraints
        connection.createStatement().executeUpdate("ALTER TABLE PUBLIC.PROJECT DROP CONSTRAINT UKcy6vkpb2h530edd3mhnsb4agf");
        connection.createStatement().executeUpdate("ALTER TABLE PUBLIC.PROJECT DROP CONSTRAINT FKo06v2e9kuapcugnyhttqa1vpt");

        //drop column
        connection.createStatement().executeUpdate("ALTER TABLE PUBLIC.PROJECT DROP COLUMN USER_ID");
    }
}
