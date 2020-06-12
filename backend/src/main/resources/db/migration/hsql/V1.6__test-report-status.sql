alter table PUBLIC.test_report add column status integer;
update PUBLIC.test_report set status = 2;

alter table PUBLIC.test_execution_config drop column create_report;