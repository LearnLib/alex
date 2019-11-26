create table PUBLIC.symbol_output_mapping (
  id                    bigint not null,
  name                  varchar(255) not null,
  symbol_parameter_id   bigint,

  primary key (id),
  constraint FkSymbolOutputMappingSymbolParameter foreign key (symbol_parameter_id) references PUBLIC.symbol_parameter
);

create table PUBLIC.parameterized_symbol_output_mappings
(
    parameterized_symbol_id bigint not null,
    output_mappings_id      bigint not null,

    constraint FkParameterizedSymbolOutputMappings_ParameterizedSymbol foreign key (output_mappings_id) references PUBLIC.symbol_output_mapping,
    constraint FkParameterizedSymbolOutputMappings_OutputMappings foreign key (parameterized_symbol_id) references PUBLIC.parameterized_symbol
);

alter table PUBLIC.symbol_parameter drop column is_private;

alter table PUBLIC.parameterized_symbol add column alias varchar(255);