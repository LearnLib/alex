package db.migration;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;

import java.sql.Connection;
import java.sql.ResultSet;

public class V1_12__SymbolOutputMappings extends BaseJavaMigration {

    public void migrate(Context context) throws Exception {
        final Connection connection = context.getConnection();

        deleteUnusedParameterReferences(connection);

        final String createSymbolOutputMappingTable = ""
                + "create table PUBLIC.symbol_output_mapping ("
                + "  id                    bigint identity not null,"
                + "  name                  varchar(255) not null,"
                + "  symbol_parameter_id   bigint,"
                + "  primary key (id),"
                + "  constraint FkSymbolOutputMappingSymbolParameter foreign key (symbol_parameter_id) references PUBLIC.symbol_parameter"
                + ");";

        final String createParameterizedSymbolOutputMappingsTable = ""
                + "create table PUBLIC.parameterized_symbol_output_mappings("
                + "    parameterized_symbol_id bigint not null,"
                + "    output_mappings_id      bigint not null,"
                + "    constraint FkParameterizedSymbolOutputMappings_ParameterizedSymbol foreign key (output_mappings_id) references PUBLIC.symbol_output_mapping,"
                + "    constraint FkParameterizedSymbolOutputMappings_OutputMappings foreign key (parameterized_symbol_id) references PUBLIC.parameterized_symbol"
                + ");";

        connection.createStatement().execute(createSymbolOutputMappingTable);
        connection.createStatement().execute(createParameterizedSymbolOutputMappingsTable);

        connection.createStatement().executeUpdate("alter table PUBLIC.symbol_parameter drop column is_private;");
        connection.createStatement().executeUpdate("alter table PUBLIC.parameterized_symbol add column alias varchar(255);");

        createOutputMappingsForExistingOutputParameters(connection);
        setDefaultParameterValuesForNullValues(connection);
    }

    private void deleteUnusedParameterReferences(Connection connection) throws Exception {
        // fix null references
        connection.createStatement().executeUpdate("update symbol_parameter sp set symbol_id = (select symbol_id from symbol_inputs si where si.inputs_id = sp.id) where symbol_id is null");

        final String q = ""
                + "select id from PUBLIC.symbol_parameter where symbol_id is null "
                + "union "
                + "select id from symbol_parameter sp where sp.dtype = 'SymbolInputParameter' and (select count(*) from symbol_inputs where inputs_id = sp.id) = 0 "
                + "union "
                + "select id from symbol_parameter sp where sp.dtype = 'SymbolOutputParameter' and (select count(*) from symbol_outputs where outputs_id = sp.id) = 0";

        connection.createStatement().execute("delete from PUBLIC.symbol_inputs where inputs_id in (" + q + ")");
        connection.createStatement().execute("delete from PUBLIC.symbol_outputs where outputs_id in (" + q + ")");
        connection.createStatement().execute("delete from PUBLIC.parameterized_symbol_parameter_values where parameter_values_id in (select id from symbol_parameter_value where symbol_parameter_id in (" + q + "))");
        connection.createStatement().execute("delete from PUBLIC.symbol_parameter_value where symbol_parameter_id in (" + q + ")");
        connection.createStatement().execute("delete from PUBLIC.symbol_parameter where symbol_id is null");
    }

    private void createOutputMappingsForExistingOutputParameters(Connection connection) throws Exception {
        final ResultSet pSymbolRows = connection.createStatement().executeQuery("select id, symbol_id from PUBLIC.PARAMETERIZED_SYMBOL");
        while (pSymbolRows.next()) {
            final String pSymbolId = pSymbolRows.getString(1);
            final String symbolId = pSymbolRows.getString(2);

            final ResultSet outputParameterRows = connection.createStatement().executeQuery("select id, name from PUBLIC.symbol_parameter where dtype = 'SymbolOutputParameter' and symbol_id = " + symbolId);
            while (outputParameterRows.next()) {
                final String outputParameterId = outputParameterRows.getString(1);
                final String outputParameterName = outputParameterRows.getString(2);

                connection.createStatement().execute("insert into symbol_output_mapping (name, symbol_parameter_id) values ('" + outputParameterName +"', " + outputParameterId + ")");

                final ResultSet outputMappingRows = connection.createStatement().executeQuery("select id from symbol_output_mapping order by id desc limit 1");
                while (outputMappingRows.next()) {
                    final String outputMappingId = outputMappingRows.getString(1);
                    connection.createStatement().execute("insert into PUBLIC.parameterized_symbol_output_mappings (parameterized_symbol_id, output_mappings_id) values (" + pSymbolId + ", " + outputMappingId + ")");
                }
            }
        }
    }

    private void setDefaultParameterValuesForNullValues(Connection connection) throws Exception {
        final ResultSet parameterValueRows = connection.createStatement().executeQuery("select id, symbol_parameter_id from PUBLIC.symbol_parameter_value where \"value\" is null or \"value\" = ''");
        while (parameterValueRows.next()) {
            final String valueId = parameterValueRows.getString(1);
            final String parameterId = parameterValueRows.getString(2);

            final ResultSet parameterRows = connection.createStatement().executeQuery("select name, parameter_type from PUBLIC.symbol_parameter where id = " + parameterId + " limit 1");
            parameterRows.next();
            final String parameterName = parameterRows.getString(1);
            final String parameterType = parameterRows.getString(2);

            final String value = parameterType.equals("1") ? "{{$" + parameterName + "}}" : "{{#" + parameterName + "}}";
            connection.createStatement().executeUpdate("update PUBLIC.symbol_parameter_value set \"value\" = '" + value + "' where id = " + valueId);
        }
    }
}
