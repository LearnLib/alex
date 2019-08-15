create table PUBLIC.project_environment
(
    id          bigint  not null,
    name        varchar(255),
    project_id  bigint  not null,
    is_default  boolean not null default false,
    primary key (id),
    foreign key (project_id) references PUBLIC.project,
    constraint unique_environment_name_per_project unique (project_id, name)
);

create table PUBLIC.LEARNER_RESULT_ENVIRONMENTS
(
    learner_result_id bigint not null,
    environments_id   bigint not null,
    constraint learner_result_id_fk foreign key (learner_result_id) references PUBLIC.learner_result,
    constraint environment_id_fk foreign key (environments_id) references PUBLIC.project_environment
);

alter table PUBLIC.project_url add column environment_id bigint not null default -1;
alter table PUBLIC.project_url add constraint FkProjectUrlProjectEnvironment foreign key (environment_id) references PUBLIC.project_environment;
alter table PUBLIC.project_url drop constraint FK9f02w2m3biqaq2ooy55cusccr;

alter table PUBLIC.test_execution_config add column environment_id bigint not null default -1;
alter table PUBLIC.test_execution_config add constraint FkTestExecutionConfigProjectEnvironment foreign key (environment_id) references PUBLIC.project_environment;
alter table PUBLIC.test_execution_config drop constraint FKgpe6t1mwus6dpsm59q2nn22g1;