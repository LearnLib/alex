alter table PUBLIC.learner_result drop column edges;
alter table PUBLIC.learner_result drop column init_node;
alter table PUBLIC.learner_result drop column nodes;
alter table PUBLIC.learner_result drop column duration_eq_oracle;
alter table PUBLIC.learner_result drop column duration_learner;
alter table PUBLIC.learner_result drop column eqs_used;
alter table PUBLIC.learner_result drop column mqs_eq_oracle;
alter table PUBLIC.learner_result drop column mqs_learner;
alter table PUBLIC.learner_result drop column start_date;
alter table PUBLIC.learner_result drop column start_time;
alter table PUBLIC.learner_result drop column symbols_used_eq_oracle;
alter table PUBLIC.learner_result drop column symbols_used_learner;
alter table PUBLIC.learner_result drop column error_text;

alter table PUBLIC.learner_result_step drop column start_time;

alter table PUBLIC.learner_result add column status integer;
update PUBLIC.learner_result set status = 2;