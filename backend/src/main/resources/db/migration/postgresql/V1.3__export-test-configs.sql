-- Add name to testExecutionConfigs
ALTER TABLE test_execution_config
    ADD COLUMN name VARCHAR(255) default '';