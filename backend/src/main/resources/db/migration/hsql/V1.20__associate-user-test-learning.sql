alter table PUBLIC.test_report add column executed_by_id bigint null;
alter table PUBLIC.test_report add constraint fk_test_report_executed_by_user_id
  foreign key (executed_by_id) references PUBLIC.user on DELETE SET NULL;

alter table PUBLIC.learner_result add column executed_by_id bigint null;
alter table PUBLIC.learner_result add constraint fk_learner_result_executed_by_user_id
  foreign key (executed_by_id) references PUBLIC.user on DELETE SET NULL;