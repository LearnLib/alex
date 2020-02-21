alter table PUBLIC.symbol add column last_updated_by_id bigint null;
alter table PUBLIC.symbol add constraint fk_symbol_last_updated_by_user_id
  foreign key (last_updated_by_id) references PUBLIC.user on DELETE SET NULL;

alter table PUBLIC.test add column last_updated_by_id bigint null;
alter table PUBLIC.test add constraint fk_test_case_last_updated_by_user_id
  foreign key (last_updated_by_id) references PUBLIC.user on DELETE SET NULL;