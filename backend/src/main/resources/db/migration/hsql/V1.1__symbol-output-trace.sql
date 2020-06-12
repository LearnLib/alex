alter table PUBLIC.execute_result add column trace MEDIUMTEXT default '';
update PUBLIC.execute_result set trace = '';