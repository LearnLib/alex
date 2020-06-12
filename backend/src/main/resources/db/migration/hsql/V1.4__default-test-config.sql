alter table PUBLIC.test_execution_config add column is_default boolean;
update PUBLIC.test_execution_config set is_default = false;