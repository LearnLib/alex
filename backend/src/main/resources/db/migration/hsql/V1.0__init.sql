create sequence hibernate_sequence start with 1 increment by 1;

create table PUBLIC.abstract_web_driver_config
(
    name              varchar(31) not null,
    id                bigint      not null,
    height            integer     not null check (height >= 0),
    implicitly_wait   integer     not null,
    page_load_timeout integer     not null,
    script_timeout    integer     not null,
    width             integer     not null check (width >= 0),
    headless          boolean,
    browser           varchar(255),
    platform          integer,
    version           varchar(255),
    primary key (id)
);
create table PUBLIC.actions
(
    type                     varchar(31) not null,
    id                       bigint      not null,
    dnd_source_node_selector varchar(255),
    dnd_source_node_type     integer,
    dnd_target_node_selector varchar(255),
    dnd_target_node_type     integer,
    selector                 MEDIUMTEXT,
    selector_type            integer,
    async                    boolean,
    name                     varchar(255),
    script                   MEDIUMTEXT,
    timeout                  integer check (timeout >= 0),
    increment_by             integer,
    "regexp"                 boolean,
    title                    varchar(255),
    duration                 bigint check (duration >= 0),
    "value"                  varchar(255),
    cookie_type              integer,
    max_wait_time            bigint check (max_wait_time >= 0),
    operator                 integer,
    assert_counter_value     integer,
    value_type               integer,
    status                   integer check (status >= 100),
    wait_criterion           integer,
    offsetx                  integer,
    offsety                  integer,
    password                 varchar(255),
    url                      varchar(255),
    mth_group                integer check (mth_group >= 0),
    nth_match                integer check (nth_match >= 1),
    regex                    varchar(255),
    attribute                varchar(255),
    target                   integer,
    json_type                integer,
    "key"                    varchar(255),
    file_name                varchar(255),
    check_method             integer,
    text                     varchar(255),
    variable_name            varchar(255),
    double_click             boolean,
    "schema"                 MEDIUMTEXT,
    select_by                integer,
    action                   integer,
    cookies                  blob(255),
    data                     MEDIUMTEXT,
    headers                  blob(255),
    method                   integer,
    tag_name                 varchar(255),
    browser_action           integer,
    symbol_id                bigint,
    primary key (id)
);
create table PUBLIC.counter
(
    id         bigint  not null,
    name       varchar(255),
    value      integer not null,
    project_id bigint  not null,
    primary key (id)
);
create table PUBLIC.execute_result
(
    dtype          varchar(31) not null,
    id             bigint      not null,
    message        varchar(255),
    success        boolean     not null,
    time           bigint,
    test_result_id bigint      not null,
    symbol_id      bigint      not null,
    primary key (id)
);
create table PUBLIC.learner_result
(
    id                     bigint  not null,
    algorithm              varbinary(255),
    comment                varchar(255),
    error_text             varchar(255),
    edges                  MEDIUMTEXT,
    init_node              integer,
    nodes                  varchar(255),
    duration_eq_oracle     bigint,
    duration_learner       bigint,
    eqs_used               bigint  not null,
    mqs_eq_oracle          bigint,
    mqs_learner            bigint,
    start_date             timestamp,
    start_time             bigint  not null,
    symbols_used_eq_oracle bigint,
    symbols_used_learner   bigint,
    test_no                bigint  not null,
    usemqcache             boolean not null,
    driver_config_id       bigint,
    post_symbol_id         bigint,
    project_id             bigint  not null,
    reset_symbol_id        bigint,
    primary key (id)
);
create table PUBLIC.learner_result_symbols
(
    learner_result_id bigint not null,
    symbols_id        bigint not null
);
create table PUBLIC.learner_result_urls
(
    learner_result_id bigint not null,
    urls_id           bigint not null
);
create table PUBLIC.learner_result_step
(
    id                     bigint  not null,
    algorithm_information  MEDIUMTEXT,
    counter_example        MEDIUMTEXT,
    eq_oracle              BLOB,
    error_text             varchar(255),
    edges                  MEDIUMTEXT,
    init_node              integer,
    nodes                  varchar(255),
    state                  BLOB,
    duration_eq_oracle     bigint,
    duration_learner       bigint,
    eqs_used               bigint  not null,
    mqs_eq_oracle          bigint,
    mqs_learner            bigint,
    start_date             timestamp,
    start_time             bigint  not null,
    symbols_used_eq_oracle bigint,
    symbols_used_learner   bigint,
    step_no                bigint  not null,
    steps_to_learn         integer not null check (steps_to_learn >= -1),
    result_id              bigint  not null,
    primary key (id)
);
create table PUBLIC.lts_formula
(
    id         bigint not null,
    formula    MEDIUMTEXT,
    name       MEDIUMTEXT,
    project_id bigint,
    primary key (id)
);
create table PUBLIC.parameterized_symbol
(
    id        bigint not null,
    symbol_id bigint,
    primary key (id)
);
create table PUBLIC.parameterized_symbol_parameter_values
(
    parameterized_symbol_id bigint not null,
    parameter_values_id     bigint not null
);
create table PUBLIC.project
(
    id          bigint not null,
    description varchar(250),
    name        varchar(255),
    user_id     bigint not null,
    primary key (id)
);
create table PUBLIC.project_url
(
    id          bigint  not null,
    default_url boolean not null,
    name        varchar(255),
    url         varchar(255),
    project_id  bigint  not null,
    primary key (id)
);
create table PUBLIC.settings
(
    id                      bigint  not null,
    allow_user_registration boolean not null,
    chrome                  varchar(255),
    default_driver          varchar(255),
    edge                    varchar(255),
    firefox                 varchar(255),
    ie                      varchar(255),
    remote                  varchar(255),
    primary key (id)
);
create table PUBLIC.symbol
(
    id              bigint  not null,
    description     MEDIUMTEXT,
    expected_result MEDIUMTEXT,
    hidden          boolean not null,
    name            varchar(255),
    success_output  varchar(255),
    group_id        bigint  not null,
    project_id      bigint  not null,
    primary key (id)
);
create table PUBLIC.symbol_inputs
(
    symbol_id bigint not null,
    inputs_id bigint not null
);
create table PUBLIC.symbol_outputs
(
    symbol_id  bigint not null,
    outputs_id bigint not null
);
create table PUBLIC.symbol_group
(
    id         bigint not null,
    name       varchar(255),
    parent_id  bigint,
    project_id bigint not null,
    primary key (id)
);
create table PUBLIC.symbol_parameter
(
    dtype          varchar(31) not null,
    id             bigint      not null,
    name           varchar(255),
    parameter_type integer,
    is_private     boolean,
    symbol_id      bigint,
    primary key (id)
);
create table PUBLIC.symbol_parameter_value
(
    id                  bigint not null,
    "value"             varchar(255),
    symbol_parameter_id bigint,
    primary key (id)
);
create table PUBLIC.symbol_step
(
    dtype          varchar(31) not null,
    id             bigint      not null,
    disabled       boolean     not null,
    error_output   varchar(255),
    ignore_failure boolean     not null,
    negated        boolean     not null,
    position       integer,
    symbol_id      bigint      not null,
    p_symbol_id    bigint,
    action_id      bigint,
    primary key (id)
);
create table PUBLIC.test
(
    type       varchar(31) not null,
    id         bigint      not null,
    name       varchar(255),
    generated  boolean,
    parent_id  bigint,
    project_id bigint      not null,
    primary key (id)
);
create table PUBLIC.test_case_post_steps
(
    test_case_id      bigint not null,
    test_case_step_id bigint not null
);
create table PUBLIC.test_case_pre_steps
(
    test_case_id      bigint not null,
    test_case_step_id bigint not null
);
create table PUBLIC.test_case_steps
(
    test_case_id      bigint not null,
    test_case_step_id bigint not null
);
create table PUBLIC.test_case_test_case_step
(
    test_case_id      bigint not null,
    test_case_step_id bigint not null,
    primary key (test_case_step_id)
);
create table PUBLIC.test_case_step
(
    id                      bigint       not null,
    expected_output_message varchar(255) not null,
    expected_output_success boolean      not null,
    expected_result         MEDIUMTEXT,
    number                  integer      not null,
    p_symbol_id             bigint,
    primary key (id)
);
create table PUBLIC.test_execution_config
(
    id               bigint  not null,
    create_report    boolean not null,
    driver_config_id bigint  not null,
    project_id       bigint,
    url_id           bigint  not null,
    primary key (id)
);
create table PUBLIC.test_execution_config_tests
(
    test_execution_config_id bigint not null,
    tests_id                 bigint not null
);
create table PUBLIC.test_report
(
    id         bigint not null,
    start_date timestamp,
    project_id bigint not null,
    primary key (id)
);
create table PUBLIC.test_result
(
    type              varchar(31) not null,
    id                bigint      not null,
    time              bigint      not null,
    failed_step       bigint,
    test_cases_failed bigint,
    test_cases_passed bigint,
    project_id        bigint      not null,
    test_id           bigint,
    test_report_id    bigint,
    primary key (id)
);
create table PUBLIC.uploadable_file
(
    id         bigint not null,
    name       varchar(255),
    project_id bigint,
    primary key (id)
);
create table PUBLIC.user
(
    id       bigint not null,
    email    varchar(255),
    password varchar(255),
    role     integer,
    salt     varchar(255),
    primary key (id)
);
create table PUBLIC.webhook
(
    id      bigint       not null,
    name    varchar(255),
    url     varchar(255) not null,
    user_id bigint       not null,
    primary key (id)
);
create table PUBLIC.webhook_events
(
    webhook_id bigint not null,
    events     integer
);

create index IDXhslp9b54f60nhnwrb5d6t0hxj on PUBLIC.actions (symbol_id);

alter table PUBLIC.counter
    add constraint UKnedoop4vktl49gphpecyb0302 unique (project_id, name);
alter table PUBLIC.learner_result
    add constraint UK1xdiwqvvr4uak4eyvaloidxw6 unique (project_id, test_no);
alter table PUBLIC.learner_result_step
    add constraint UKl170td7y8i5k2wbfptmev6qs7 unique (result_id, step_no);
alter table PUBLIC.parameterized_symbol_parameter_values
    add constraint UK_1nggq41nijj8e7csydkf39jck unique (parameter_values_id);
alter table PUBLIC.project
    add constraint UKcy6vkpb2h530edd3mhnsb4agf unique (user_id, name);
alter table PUBLIC.symbol
    add constraint unique_name_in_project unique (project_id, name);
alter table PUBLIC.symbol_inputs
    add constraint UK_tgf0yr1o7k1wavn7u8bnl2wbn unique (inputs_id);
alter table PUBLIC.symbol_outputs
    add constraint UK_bui1c7crucilhscqgcxx208wx unique (outputs_id);
alter table PUBLIC.test_case_post_steps
    add constraint UK_6l8bqlrgkhs4brg95jbu08tk5 unique (test_case_step_id);
alter table PUBLIC.test_case_pre_steps
    add constraint UK_43ug1q0y9bfhrnup0inf69x87 unique (test_case_step_id);
alter table PUBLIC.test_case_steps
    add constraint UK_ru0hilds75oxmo71p7ab45wi4 unique (test_case_step_id);
alter table PUBLIC.uploadable_file
    add constraint UKox8663p0ht73e1yqx7dbg9rri unique (project_id, name);
alter table PUBLIC.user
    add constraint UK_ob8kqyqqgmefl0aco34akdtpe unique (email);
alter table PUBLIC.actions
    add constraint FKdyiy4jfiwrfbj2u2rcd95y7jc foreign key (symbol_id) references PUBLIC.symbol;
alter table PUBLIC.counter
    add constraint FKaavgl6d4nkhdcj0v0eusx0jj4 foreign key (project_id) references PUBLIC.project;
alter table PUBLIC.execute_result
    add constraint FKnerht22vsd7a6eo6mwfxtko7t foreign key (test_result_id) references PUBLIC.test_result;
alter table PUBLIC.execute_result
    add constraint FKkp13f4xw3uiuwmgej5xsaky68 foreign key (symbol_id) references PUBLIC.symbol;
alter table PUBLIC.learner_result
    add constraint FK1l0rtoqctik4utsu2rfxpioii foreign key (driver_config_id) references PUBLIC.abstract_web_driver_config;
alter table PUBLIC.learner_result
    add constraint FKql8rlh0xxl6d6ghnrt17a45t0 foreign key (post_symbol_id) references PUBLIC.parameterized_symbol;
alter table PUBLIC.learner_result
    add constraint FK7i3a026vc6ct38n8kkqkxectp foreign key (project_id) references PUBLIC.project;
alter table PUBLIC.learner_result
    add constraint FK48d189so0cfqr8lijdyrp2gta foreign key (reset_symbol_id) references PUBLIC.parameterized_symbol;
alter table PUBLIC.learner_result_symbols
    add constraint FK9ojoq9mh6hx6xcv5owtjplgfr foreign key (symbols_id) references PUBLIC.parameterized_symbol;
alter table PUBLIC.learner_result_symbols
    add constraint FKom9y9t3fa7dn6ryw5yolfpkj9 foreign key (learner_result_id) references PUBLIC.learner_result;
alter table PUBLIC.learner_result_urls
    add constraint FKqj14ybhbxukhv1r4cd9usweti foreign key (urls_id) references PUBLIC.project_url;
alter table PUBLIC.learner_result_urls
    add constraint FKpevvpmyxhb7wwvofgket9756f foreign key (learner_result_id) references PUBLIC.learner_result;
alter table PUBLIC.learner_result_step
    add constraint FKimq02808edmlkv38l6p8yg9yx foreign key (result_id) references PUBLIC.learner_result;
alter table PUBLIC.lts_formula
    add constraint FK9pjao7e8l487mgxb2qt4syute foreign key (project_id) references PUBLIC.project;
alter table PUBLIC.parameterized_symbol
    add constraint FKaag4hdqos9jacrtqni7xa6ka1 foreign key (symbol_id) references PUBLIC.symbol;
alter table PUBLIC.parameterized_symbol_parameter_values
    add constraint FK3bfee54qh35fd4cjx533cgoih foreign key (parameter_values_id) references PUBLIC.symbol_parameter_value;
alter table PUBLIC.parameterized_symbol_parameter_values
    add constraint FKg25w0qjoewfbwsuhjwfgl3uub foreign key (parameterized_symbol_id) references PUBLIC.parameterized_symbol;
alter table PUBLIC.project
    add constraint FKo06v2e9kuapcugnyhttqa1vpt foreign key (user_id) references PUBLIC.user;
alter table PUBLIC.project_url
    add constraint FK9f02w2m3biqaq2ooy55cusccr foreign key (project_id) references PUBLIC.project;
alter table PUBLIC.symbol
    add constraint FK5s2d7oahddv924jq9vsgenqq8 foreign key (group_id) references PUBLIC.symbol_group;
alter table PUBLIC.symbol
    add constraint FKk54rhwwqee167tav7yb4v08bg foreign key (project_id) references PUBLIC.project;
alter table PUBLIC.symbol_inputs
    add constraint FK4djwa7yvhv92wn3yqnoabd422 foreign key (inputs_id) references PUBLIC.symbol_parameter;
alter table PUBLIC.symbol_inputs
    add constraint FKo2eafr9ov812yhaio3wqxn9mc foreign key (symbol_id) references PUBLIC.symbol;
alter table PUBLIC.symbol_outputs
    add constraint FKeilgaeyjiqo92uwol984dwgv2 foreign key (outputs_id) references PUBLIC.symbol_parameter;
alter table PUBLIC.symbol_outputs
    add constraint FKsdgwtmjok6o9h8mh01k2kewhc foreign key (symbol_id) references PUBLIC.symbol;
alter table PUBLIC.symbol_group
    add constraint FK3gtx3vjy2gv9apxsnq4hwd0ul foreign key (parent_id) references PUBLIC.symbol_group;
alter table PUBLIC.symbol_group
    add constraint FKdmvt2mukk3dgmxjj1gdvsw85l foreign key (project_id) references PUBLIC.project;
alter table PUBLIC.symbol_parameter
    add constraint FKtprve66ieoegv1knxxwwieu9c foreign key (symbol_id) references PUBLIC.symbol;
alter table PUBLIC.symbol_parameter_value
    add constraint FK9yaayn72jow65bo2d3dawodbx foreign key (symbol_parameter_id) references PUBLIC.symbol_parameter;
alter table PUBLIC.symbol_step
    add constraint FKeb38onqefedoxpu08nid8vel4 foreign key (symbol_id) references PUBLIC.symbol;
alter table PUBLIC.symbol_step
    add constraint FK9oulg2lggfqiyw6ymfjmjer4f foreign key (p_symbol_id) references PUBLIC.parameterized_symbol;
alter table PUBLIC.symbol_step
    add constraint FKq3gboshkf39k83egpyjij6rmo foreign key (action_id) references PUBLIC.actions;
alter table PUBLIC.test
    add constraint FKq5w11j636d28d2ochagtxavrq foreign key (parent_id) references PUBLIC.test;
alter table PUBLIC.test
    add constraint FKael9sac0jyge72osrwuou49i1 foreign key (project_id) references PUBLIC.project;
alter table PUBLIC.test_case_post_steps
    add constraint FK5brxoui44a3udhbo3s6m5u4x8 foreign key (test_case_step_id) references PUBLIC.test_case_step;
alter table PUBLIC.test_case_post_steps
    add constraint FK9rqlcyr4njedk3b3loi4uca5m foreign key (test_case_id) references PUBLIC.test;
alter table PUBLIC.test_case_pre_steps
    add constraint FK4d0i1gvtbq5i0kxsgcb5rix9a foreign key (test_case_step_id) references PUBLIC.test_case_step;
alter table PUBLIC.test_case_pre_steps
    add constraint FKkpon55j391l5xlexk7i5sl3bx foreign key (test_case_id) references PUBLIC.test;
alter table PUBLIC.test_case_steps
    add constraint FKhu3151s7g1dhnl8e3h7ij1uyi foreign key (test_case_step_id) references PUBLIC.test_case_step;
alter table PUBLIC.test_case_steps
    add constraint FKg3almgtpw7u63xjcjtuwuwh4x foreign key (test_case_id) references PUBLIC.test;
alter table PUBLIC.test_case_test_case_step
    add constraint FK6n9anes6y6xl6he80bq256c2w foreign key (test_case_id) references PUBLIC.test;
alter table PUBLIC.test_case_test_case_step
    add constraint FKre6yxpw2l7c375phx9g1oji4y foreign key (test_case_step_id) references PUBLIC.test_case_step;
alter table PUBLIC.test_case_step
    add constraint FKo2gs52bpsynckcv5bdrr1ag5h foreign key (p_symbol_id) references PUBLIC.parameterized_symbol;
alter table PUBLIC.test_execution_config
    add constraint FKdl0wn7mab0v5pse0mh2mco65f foreign key (driver_config_id) references PUBLIC.abstract_web_driver_config;
alter table PUBLIC.test_execution_config
    add constraint FKnkpxwgft1t4b63dj1dk9sosis foreign key (project_id) references PUBLIC.project;
alter table PUBLIC.test_execution_config
    add constraint FKgpe6t1mwus6dpsm59q2nn22g1 foreign key (url_id) references PUBLIC.project_url;
alter table PUBLIC.test_execution_config_tests
    add constraint FK5i3pcjq5fmxkj8xo76uulr2re foreign key (tests_id) references PUBLIC.test;
alter table PUBLIC.test_execution_config_tests
    add constraint FKc2lhys0fgpgrxdy8nr8wlxdbv foreign key (test_execution_config_id) references PUBLIC.test_execution_config;
alter table PUBLIC.test_report
    add constraint FKsir1poigje0jtwnn8o63f95ot foreign key (project_id) references PUBLIC.project;
alter table PUBLIC.test_result
    add constraint FKpr4hhuech3sa487a34vqsk46k foreign key (project_id) references PUBLIC.project;
alter table PUBLIC.test_result
    add constraint FKef3e8k7fgvkj4mox0lxrkf8hh foreign key (test_id) references PUBLIC.test;
alter table PUBLIC.test_result
    add constraint FK4wgggo81mkl0j62xuqy0mnceq foreign key (test_report_id) references PUBLIC.test_report;
alter table PUBLIC.uploadable_file
    add constraint FKo80h1mqgb2aog7y6kaaukvg4a foreign key (project_id) references PUBLIC.project;
alter table PUBLIC.webhook
    add constraint FK24yq79vi3y4xpnfn9ff36tycb foreign key (user_id) references PUBLIC.user;
alter table PUBLIC.webhook_events
    add constraint FKtjrlc3ohx87f7gxbr5ogcynp0 foreign key (webhook_id) references PUBLIC.webhook;