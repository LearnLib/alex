create table PUBLIC.test_screenshot(
    id                          bigint      not null,
    filename                    varchar(31) not null,
    primary key (id)
);

alter table PUBLIC.execute_result add column test_screenshot_id bigint;
alter table PUBLIC.test_result add column before_test_screenshot_id bigint;

alter table PUBLIC.test_result add constraint fk_before_test_screenshot_id
    foreign key (before_test_screenshot_id) references PUBLIC.test_screenshot;
alter table PUBLIC.execute_result add constraint fk_execute_result_test_screenshot_id
    foreign key (test_screenshot_id) references PUBLIC.test_screenshot on DELETE set null;