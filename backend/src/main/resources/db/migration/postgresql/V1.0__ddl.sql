create table PROJECT
(
    ID          BIGINT GENERATED BY DEFAULT AS identity,
    DESCRIPTION VARCHAR(250),
    NAME        VARCHAR(255),
    primary key (ID)
);

create table COUNTER
(
    ID         BIGINT  GENERATED BY DEFAULT AS identity,
    NAME       VARCHAR(255),
    VALUE      INTEGER not null,
    PROJECT_ID BIGINT  not null,
    primary key (ID),
    unique (PROJECT_ID, NAME),
    constraint FKAAVGL6D4NKHDCJ0V0EUSX0JJ4
        foreign key (PROJECT_ID) references PROJECT
);

create table LTS_FORMULA_SUITE
(
    ID         BIGINT GENERATED BY DEFAULT AS identity,
    NAME       VARCHAR(255) default '',
    PROJECT_ID BIGINT not null,
    primary key (ID),
    unique (NAME, PROJECT_ID),
    constraint FKLTSFORMULASUITEPROJECT
        foreign key (PROJECT_ID) references PROJECT
);

create table LTS_FORMULA
(
    ID       BIGINT GENERATED BY DEFAULT AS identity,
    FORMULA  TEXT,
    NAME     TEXT,
    SUITE_ID BIGINT,
    primary key (ID),
    constraint FKLTSFORMULALTSFORMULASUITE
        foreign key (SUITE_ID) references LTS_FORMULA_SUITE
);

create table PROJECT_ENVIRONMENT
(
    ID         BIGINT GENERATED BY DEFAULT AS identity,
    NAME       VARCHAR(255),
    PROJECT_ID BIGINT                not null,
    IS_DEFAULT BOOLEAN default FALSE not null,
    primary key (ID),
    unique (PROJECT_ID, NAME),
    foreign key (PROJECT_ID) references PROJECT
);

create table PROJECT_ENVIRONMENT_VARIABLE
(
    ID             BIGINT GENERATED BY DEFAULT AS identity,
    NAME           VARCHAR(255),
    VALUE          VARCHAR(255),
    ENVIRONMENT_ID BIGINT not null,
    primary key (ID),
    unique (ENVIRONMENT_ID, NAME),
    foreign key (ENVIRONMENT_ID) references PROJECT_ENVIRONMENT
);

create table PROJECT_URL
(
    ID             BIGINT  GENERATED BY DEFAULT AS identity,
    IS_DEFAULT     BOOLEAN not null,
    NAME           VARCHAR(255),
    URL            VARCHAR(255),
    ENVIRONMENT_ID BIGINT,
    primary key (ID),
    constraint FKPROJECTURLPROJECTENVIRONMENT
        foreign key (ENVIRONMENT_ID) references PROJECT_ENVIRONMENT
);

create table SETTINGS
(
    ID                      BIGINT  GENERATED BY DEFAULT AS identity,
    ALLOW_USER_REGISTRATION BOOLEAN not null,
    CHROME                  VARCHAR(255),
    DEFAULT_DRIVER          VARCHAR(255),
    EDGE                    VARCHAR(255),
    FIREFOX                 VARCHAR(255),
    IE                      VARCHAR(255),
    REMOTE                  VARCHAR(255),
    primary key (ID)
);

create table SYMBOL_GROUP
(
    ID         BIGINT GENERATED BY DEFAULT AS identity,
    NAME       VARCHAR(255),
    PARENT_ID  BIGINT,
    PROJECT_ID BIGINT not null,
    primary key (ID),
    constraint FK3GTX3VJY2GV9APXSNQ4HWD0UL
        foreign key (PARENT_ID) references SYMBOL_GROUP,
    constraint FKDMVT2MUKK3DGMXJJ1GDVSW85L
        foreign key (PROJECT_ID) references PROJECT
);

create table TEST_SCREENSHOT
(
    ID       BIGINT      GENERATED BY DEFAULT AS identity,
    FILENAME VARCHAR(31) not null,
    primary key (ID)
);

create table UPLOADABLE_FILE
(
    ID         BIGINT GENERATED BY DEFAULT AS identity,
    NAME       VARCHAR(255),
    PROJECT_ID BIGINT,
    primary key (ID),
    unique (PROJECT_ID, NAME),
    constraint FKO80H1MQGB2AOG7Y6KAAUKVG4A
        foreign key (PROJECT_ID) references PROJECT
);

create table "user"
(
    ID       BIGINT      GENERATED BY DEFAULT AS identity,
    EMAIL    VARCHAR(255),
    PASSWORD VARCHAR(255),
    ROLE     INTEGER,
    SALT     VARCHAR(255),
    USERNAME VARCHAR(32) not null,
    primary key (ID),
    unique (USERNAME),
    unique (EMAIL)
);

create table PROJECT_MEMBERS
(
    PROJECT_ID BIGINT not null,
    USER_ID    BIGINT not null,
    unique (USER_ID, PROJECT_ID),
    constraint FK_PROJECT_MEMBERS_PROJECT_ID
        foreign key (PROJECT_ID) references PROJECT,
    constraint FK_PROJECT_MEMBERS_USER_ID
        foreign key (USER_ID) references "user"
);

create table PROJECT_OWNERS
(
    PROJECT_ID BIGINT not null,
    USER_ID    BIGINT not null,
    unique (USER_ID, PROJECT_ID),
    constraint FK_PROJECT_OWNERS_PROJECT_ID
        foreign key (PROJECT_ID) references PROJECT,
    constraint FK_PROJECT_OWNERS_USER_ID
        foreign key (USER_ID) references "user"
);

create table SYMBOL
(
    ID                 BIGINT                           GENERATED BY DEFAULT AS identity,
    DESCRIPTION        TEXT,
    EXPECTED_RESULT    TEXT,
    HIDDEN             BOOLEAN                          not null,
    NAME               VARCHAR(255),
    SUCCESS_OUTPUT     VARCHAR(255),
    GROUP_ID           BIGINT                           not null,
    PROJECT_ID         BIGINT                           not null,
    UPDATED_ON         TIMESTAMP default LOCALTIMESTAMP not null,
    LAST_UPDATED_BY_ID BIGINT,
    primary key (ID),
    unique (PROJECT_ID, NAME),
    constraint FK5S2D7OAHDDV924JQ9VSGENQQ8
        foreign key (GROUP_ID) references SYMBOL_GROUP,
    constraint FKK54RHWWQEE167TAV7YB4V08BG
        foreign key (PROJECT_ID) references PROJECT,
    constraint FK_SYMBOL_LAST_UPDATED_BY_USER_ID
        foreign key (LAST_UPDATED_BY_ID) references "user"
            on delete set null
);

create table ACTIONS
(
    TYPE                     VARCHAR(31) not null,
    ID                       BIGINT      GENERATED BY DEFAULT AS identity,
    DND_SOURCE_NODE_SELECTOR VARCHAR(255),
    DND_SOURCE_NODE_TYPE     INTEGER,
    DND_TARGET_NODE_SELECTOR VARCHAR(255),
    DND_TARGET_NODE_TYPE     INTEGER,
    SELECTOR                 TEXT,
    SELECTOR_TYPE            INTEGER,
    ASYNC                    BOOLEAN,
    NAME                     VARCHAR(255),
    SCRIPT                   TEXT,
    TIMEOUT                  INTEGER CHECK ( TIMEOUT >= 0 ),
    INCREMENT_BY             INTEGER,
    "regexp"                 BOOLEAN,
    TITLE                    VARCHAR(255),
    DURATION                 BIGINT CHECK ( DURATION >= 0 ),
    "value"                  VARCHAR(255),
    COOKIE_TYPE              INTEGER,
    MAX_WAIT_TIME            BIGINT CHECK ( MAX_WAIT_TIME >= 0 ),
    OPERATOR                 INTEGER,
    ASSERT_COUNTER_VALUE     INTEGER,
    VALUE_TYPE               INTEGER,
    STATUS                   INTEGER CHECK ( STATUS >= 100 ),
    WAIT_CRITERION           INTEGER,
    OFFSETX                  INTEGER,
    OFFSETY                  INTEGER,
    PASSWORD                 VARCHAR(255),
    URL                      VARCHAR(255),
    MTH_GROUP                INTEGER CHECK ( MTH_GROUP >= 0 ),
    NTH_MATCH                INTEGER CHECK ( NTH_MATCH >= 1 ),
    REGEX                    VARCHAR(255),
    ATTRIBUTE                VARCHAR(255),
    TARGET                   INTEGER,
    JSON_TYPE                INTEGER,
    "key"                    VARCHAR(255),
    FILE_NAME                VARCHAR(255),
    CHECK_METHOD             INTEGER,
    TEXT                     VARCHAR(255),
    VARIABLE_NAME            VARCHAR(255),
    DOUBLE_CLICK             BOOLEAN,
    "schema"                 TEXT,
    SELECT_BY                INTEGER,
    ACTION                   INTEGER,
    COOKIES                  BYTEA,
    DATA                     TEXT,
    HEADERS                  BYTEA,
    METHOD                   INTEGER,
    TAG_NAME                 VARCHAR(255),
    BROWSER_ACTION           INTEGER,
    SYMBOL_ID                BIGINT,
    BASE_URL                 VARCHAR(255),
    LABEL                    VARCHAR(255),
    primary key (ID),
    constraint FKDYIY4JFIWRFBJ2U2RCD95Y7JC
        foreign key (SYMBOL_ID) references SYMBOL
);

create index IDXHSLP9B54F60NHNWRB5D6T0HXJ
    on ACTIONS (SYMBOL_ID);

create table PARAMETERIZED_SYMBOL
(
    ID        BIGINT GENERATED BY DEFAULT AS identity,
    SYMBOL_ID BIGINT,
    ALIAS     VARCHAR(255),
    primary key (ID),
    constraint FKAAG4HDQOS9JACRTQNI7XA6KA1
        foreign key (SYMBOL_ID) references SYMBOL
);

create table SYMBOL_PARAMETER
(
    DTYPE          VARCHAR(31) not null,
    ID             BIGINT      GENERATED BY DEFAULT AS identity,
    NAME           VARCHAR(255),
    PARAMETER_TYPE INTEGER,
    SYMBOL_ID      BIGINT,
    primary key (ID),
    constraint FKTPRVE66IEOEGV1KNXXWWIEU9C
        foreign key (SYMBOL_ID) references SYMBOL
);

create table SYMBOL_INPUTS
(
    SYMBOL_ID BIGINT not null,
    INPUTS_ID BIGINT not null,
    unique (INPUTS_ID),
    constraint FK4DJWA7YVHV92WN3YQNOABD422
        foreign key (INPUTS_ID) references SYMBOL_PARAMETER,
    constraint FKO2EAFR9OV812YHAIO3WQXN9MC
        foreign key (SYMBOL_ID) references SYMBOL
);

create table SYMBOL_OUTPUTS
(
    SYMBOL_ID  BIGINT not null,
    OUTPUTS_ID BIGINT not null,
    unique (OUTPUTS_ID),
    constraint FKEILGAEYJIQO92UWOL984DWGV2
        foreign key (OUTPUTS_ID) references SYMBOL_PARAMETER,
    constraint FKSDGWTMJOK6O9H8MH01K2KEWHC
        foreign key (SYMBOL_ID) references SYMBOL
);

create table SYMBOL_OUTPUT_MAPPING
(
    ID                  BIGINT GENERATED BY DEFAULT AS identity,
    NAME                VARCHAR(255) not null,
    SYMBOL_PARAMETER_ID BIGINT,
    primary key (ID),
    constraint FKSYMBOLOUTPUTMAPPINGSYMBOLPARAMETER
        foreign key (SYMBOL_PARAMETER_ID) references SYMBOL_PARAMETER
);

create table PARAMETERIZED_SYMBOL_OUTPUT_MAPPINGS
(
    PARAMETERIZED_SYMBOL_ID BIGINT not null,
    OUTPUT_MAPPINGS_ID      BIGINT not null,
    constraint FKPARAMETERIZEDSYMBOLOUTPUTMAPPINGS_OUTPUTMAPPINGS
        foreign key (PARAMETERIZED_SYMBOL_ID) references PARAMETERIZED_SYMBOL,
    constraint FKPARAMETERIZEDSYMBOLOUTPUTMAPPINGS_PARAMETERIZEDSYMBOL
        foreign key (OUTPUT_MAPPINGS_ID) references SYMBOL_OUTPUT_MAPPING
);

create table SYMBOL_PARAMETER_VALUE
(
    ID                  BIGINT GENERATED BY DEFAULT AS identity,
    "value"             VARCHAR(255),
    SYMBOL_PARAMETER_ID BIGINT,
    primary key (ID),
    constraint FK9YAAYN72JOW65BO2D3DAWODBX
        foreign key (SYMBOL_PARAMETER_ID) references SYMBOL_PARAMETER
);

create table PARAMETERIZED_SYMBOL_PARAMETER_VALUES
(
    PARAMETERIZED_SYMBOL_ID BIGINT not null,
    PARAMETER_VALUES_ID     BIGINT not null,
    unique (PARAMETER_VALUES_ID),
    constraint FK3BFEE54QH35FD4CJX533CGOIH
        foreign key (PARAMETER_VALUES_ID) references SYMBOL_PARAMETER_VALUE,
    constraint FKG25W0QJOEWFBWSUHJWFGL3UUB
        foreign key (PARAMETERIZED_SYMBOL_ID) references PARAMETERIZED_SYMBOL
);

create table SYMBOL_STEP
(
    DTYPE          VARCHAR(31) not null,
    ID             BIGINT      GENERATED BY DEFAULT AS identity,
    DISABLED       BOOLEAN     not null,
    ERROR_OUTPUT   VARCHAR(255),
    IGNORE_FAILURE BOOLEAN     not null,
    NEGATED        BOOLEAN     not null,
    POSITION       INTEGER,
    SYMBOL_ID      BIGINT      not null,
    P_SYMBOL_ID    BIGINT,
    ACTION_ID      BIGINT,
    primary key (ID),
    constraint FK9OULG2LGGFQIYW6YMFJMJER4F
        foreign key (P_SYMBOL_ID) references PARAMETERIZED_SYMBOL,
    constraint FKEB38ONQEFEDOXPU08NID8VEL4
        foreign key (SYMBOL_ID) references SYMBOL,
    constraint FKQ3GBOSHKF39K83EGPYJIJ6RMO
        foreign key (ACTION_ID) references ACTIONS
);

create table TEST
(
    TYPE               VARCHAR(31)                      not null,
    ID                 BIGINT                           GENERATED BY DEFAULT AS identity,
    NAME               VARCHAR(255),
    GENERATED          BOOLEAN,
    PARENT_ID          BIGINT,
    PROJECT_ID         BIGINT                           not null,
    UPDATED_ON         TIMESTAMP default LOCALTIMESTAMP not null,
    LAST_UPDATED_BY_ID BIGINT,
    primary key (ID),
    constraint FKAEL9SAC0JYGE72OSRWUOU49I1
        foreign key (PROJECT_ID) references PROJECT,
    constraint FKQ5W11J636D28D2OCHAGTXAVRQ
        foreign key (PARENT_ID) references TEST,
    constraint FK_TEST_CASE_LAST_UPDATED_BY_USER_ID
        foreign key (LAST_UPDATED_BY_ID) references "user"
            on delete set null
);

create table TEST_CASE_STEP
(
    ID                      BIGINT       GENERATED BY DEFAULT AS identity,
    EXPECTED_OUTPUT_MESSAGE VARCHAR(255) not null,
    EXPECTED_OUTPUT_SUCCESS BOOLEAN      not null,
    EXPECTED_RESULT         TEXT,
    NUMBER                  INTEGER      not null,
    P_SYMBOL_ID             BIGINT,
    DISABLED                BOOLEAN default FALSE,
    primary key (ID),
    constraint FKO2GS52BPSYNCKCV5BDRR1AG5H
        foreign key (P_SYMBOL_ID) references PARAMETERIZED_SYMBOL
);

create table TEST_CASE_POST_STEPS
(
    TEST_CASE_ID      BIGINT not null,
    TEST_CASE_STEP_ID BIGINT not null,
    unique (TEST_CASE_STEP_ID),
    constraint FK5BRXOUI44A3UDHBO3S6M5U4X8
        foreign key (TEST_CASE_STEP_ID) references TEST_CASE_STEP,
    constraint FK9RQLCYR4NJEDK3B3LOI4UCA5M
        foreign key (TEST_CASE_ID) references TEST
);

create table TEST_CASE_PRE_STEPS
(
    TEST_CASE_ID      BIGINT not null,
    TEST_CASE_STEP_ID BIGINT not null,
    unique (TEST_CASE_STEP_ID),
    constraint FK4D0I1GVTBQ5I0KXSGCB5RIX9A
        foreign key (TEST_CASE_STEP_ID) references TEST_CASE_STEP,
    constraint FKKPON55J391L5XLEXK7I5SL3BX
        foreign key (TEST_CASE_ID) references TEST
);

create table TEST_CASE_STEPS
(
    TEST_CASE_ID      BIGINT not null,
    TEST_CASE_STEP_ID BIGINT not null,
    unique (TEST_CASE_STEP_ID),
    constraint FKG3ALMGTPW7U63XJCJTUWUWH4X
        foreign key (TEST_CASE_ID) references TEST,
    constraint FKHU3151S7G1DHNL8E3H7IJ1UYI
        foreign key (TEST_CASE_STEP_ID) references TEST_CASE_STEP
);

create table TEST_CASE_TEST_CASE_STEP
(
    TEST_CASE_ID      BIGINT not null,
    TEST_CASE_STEP_ID BIGINT not null,
    primary key (TEST_CASE_STEP_ID),
    constraint FK6N9ANES6Y6XL6HE80BQ256C2W
        foreign key (TEST_CASE_ID) references TEST,
    constraint FKRE6YXPW2L7C375PHX9G1OJI4Y
        foreign key (TEST_CASE_STEP_ID) references TEST_CASE_STEP
);

create table TEST_REPORT
(
    ID             BIGINT GENERATED BY DEFAULT AS identity,
    START_DATE     TIMESTAMP,
    PROJECT_ID     BIGINT not null,
    ENVIRONMENT_ID BIGINT,
    STATUS         INTEGER,
    DESCRIPTION    TEXT,
    EXECUTED_BY_ID BIGINT,
    primary key (ID),
    constraint FKSIR1POIGJE0JTWNN8O63F95OT
        foreign key (PROJECT_ID) references PROJECT,
    constraint FKTESTREPORTPROJECTENVIRONMENT
        foreign key (ENVIRONMENT_ID) references PROJECT_ENVIRONMENT,
    constraint FK_TEST_REPORT_EXECUTED_BY_USER_ID
        foreign key (EXECUTED_BY_ID) references "user"
            on delete set null
);

create table TEST_RESULT
(
    TYPE                      VARCHAR(31) not null,
    ID                        BIGINT      GENERATED BY DEFAULT AS identity,
    TIME                      BIGINT      not null,
    FAILED_STEP               BIGINT,
    TEST_CASES_FAILED         BIGINT,
    TEST_CASES_PASSED         BIGINT,
    PROJECT_ID                BIGINT      not null,
    TEST_ID                   BIGINT,
    TEST_REPORT_ID            BIGINT,
    BEFORE_TEST_SCREENSHOT_ID BIGINT,
    primary key (ID),
    constraint FK4WGGGO81MKL0J62XUQY0MNCEQ
        foreign key (TEST_REPORT_ID) references TEST_REPORT,
    constraint FKEF3E8K7FGVKJ4MOX0LXRKF8HH
        foreign key (TEST_ID) references TEST,
    constraint FKPR4HHUECH3SA487A34VQSK46K
        foreign key (PROJECT_ID) references PROJECT,
    constraint FK_BEFORE_TEST_SCREENSHOT_ID
        foreign key (BEFORE_TEST_SCREENSHOT_ID) references TEST_SCREENSHOT
);

create table EXECUTE_RESULT
(
    DTYPE              VARCHAR(31) not null,
    ID                 BIGINT      GENERATED BY DEFAULT AS identity,
    MESSAGE            VARCHAR(255),
    SUCCESS            BOOLEAN     not null,
    TIME               BIGINT,
    TEST_RESULT_ID     BIGINT      not null,
    SYMBOL_ID          BIGINT      not null,
    TRACE              TEXT default '',
    TEST_SCREENSHOT_ID BIGINT,
    primary key (ID),
    constraint FKKP13F4XW3UIUWMGEJ5XSAKY68
        foreign key (SYMBOL_ID) references SYMBOL,
    constraint FKNERHT22VSD7A6EO6MWFXTKO7T
        foreign key (TEST_RESULT_ID) references TEST_RESULT,
    constraint FK_EXECUTE_RESULT_TEST_SCREENSHOT_ID
        foreign key (TEST_SCREENSHOT_ID) references TEST_SCREENSHOT
            on delete set null
);

create table WEBHOOK
(
    ID      BIGINT       GENERATED BY DEFAULT AS identity,
    NAME    VARCHAR(255),
    URL     VARCHAR(255) not null,
    USER_ID BIGINT       not null,
    primary key (ID),
    constraint FK24YQ79VI3Y4XPNFN9FF36TYCB
        foreign key (USER_ID) references "user"
);

create table WEBHOOK_EVENTS
(
    WEBHOOK_ID BIGINT not null,
    EVENTS     INTEGER,
    constraint FKTJRLC3OHX87F7GXBR5OGCYNP0
        foreign key (WEBHOOK_ID) references WEBHOOK
);

create table WEB_DRIVER_CONFIG
(
    ID                BIGINT  GENERATED BY DEFAULT AS identity,
    HEIGHT            INTEGER not null CHECK ( HEIGHT >= 0 ),
    IMPLICITLY_WAIT   INTEGER not null,
    PAGE_LOAD_TIMEOUT INTEGER not null,
    SCRIPT_TIMEOUT    INTEGER not null,
    WIDTH             INTEGER not null CHECK ( WIDTH >= 0 ),
    HEADLESS          BOOLEAN,
    BROWSER           VARCHAR(255),
    PLATFORM          INTEGER,
    VERSION           VARCHAR(255),
    primary key (ID)
);

create table LEARNER_SETUP
(
    ID                 BIGINT GENERATED BY DEFAULT AS identity,
    PROJECT_ID         BIGINT         not null,
    NAME               VARCHAR(255) default '',
    ENABLE_CACHE       BOOLEAN        not null,
    PRE_SYMBOL_ID      BIGINT         not null,
    POST_SYMBOL_ID     BIGINT,
    ALGORITHM          BYTEA not null,
    EQUIVALENCE_ORACLE BYTEA           not null,
    WEB_DRIVER_ID      BIGINT         not null,
    SAVED              BOOLEAN      default FALSE,
    primary key (ID),
    constraint FK_LEARNER_SETUP_POST_SYMBOL
        foreign key (POST_SYMBOL_ID) references PARAMETERIZED_SYMBOL,
    constraint FK_LEARNER_SETUP_PRE_SYMBOL
        foreign key (PRE_SYMBOL_ID) references PARAMETERIZED_SYMBOL,
    constraint FK_LEARNER_SETUP_PROJECT
        foreign key (PROJECT_ID) references PROJECT,
    constraint FK_LEARNER_SETUP_WEB_DRIVER
        foreign key (WEB_DRIVER_ID) references WEB_DRIVER_CONFIG
);

create table LEARNER_RESULT
(
    ID             BIGINT GENERATED BY DEFAULT AS identity,
    COMMENT        VARCHAR(255),
    TEST_NO        BIGINT not null,
    PROJECT_ID     BIGINT not null,
    STATUS         INTEGER,
    SETUP_ID       BIGINT,
    EXECUTED_BY_ID BIGINT,
    primary key (ID),
    unique (PROJECT_ID, TEST_NO),
    constraint FK7I3A026VC6CT38N8KKQKXECTP
        foreign key (PROJECT_ID) references PROJECT,
    constraint FK_LEARNER_RESULT_EXECUTED_BY_USER_ID
        foreign key (EXECUTED_BY_ID) references "user"
            on delete set null,
    constraint FK_LEARNER_RESULT_LEARNER_SETUP
        foreign key (SETUP_ID) references LEARNER_SETUP
);

create table LEARNER_RESULT_STEP
(
    ID                     BIGINT GENERATED BY DEFAULT AS identity,
    ALGORITHM_INFORMATION  TEXT,
    COUNTER_EXAMPLE        TEXT,
    EQ_ORACLE              BYTEA,
    ERROR_TEXT             VARCHAR(255),
    EDGES                  TEXT,
    INIT_NODE              INTEGER,
    NODES                  VARCHAR(255),
    STATE                  BYTEA,
    DURATION_EQ_ORACLE     BIGINT,
    DURATION_LEARNER       BIGINT,
    EQS_USED               BIGINT not null,
    MQS_EQ_ORACLE          BIGINT,
    MQS_LEARNER            BIGINT,
    START_DATE             TIMESTAMP,
    SYMBOLS_USED_EQ_ORACLE BIGINT,
    SYMBOLS_USED_LEARNER   BIGINT,
    STEP_NO                BIGINT not null,
    RESULT_ID              BIGINT not null,
    primary key (ID),
    unique (RESULT_ID, STEP_NO),
    constraint FKIMQ02808EDMLKV38L6P8YG9YX
        foreign key (RESULT_ID) references LEARNER_RESULT
);

create table LEARNER_SETUP_ENVIRONMENTS
(
    LEARNER_SETUP_ID BIGINT not null,
    ENVIRONMENTS_ID  BIGINT not null,
    constraint FK_LEARNER_SETUP_ENVIRONMENTS_ENVIRONMENT
        foreign key (ENVIRONMENTS_ID) references PROJECT_ENVIRONMENT,
    constraint FK_LEARNER_SETUP_ENVIRONMENTS_SETUP
        foreign key (LEARNER_SETUP_ID) references LEARNER_SETUP
);

create table LEARNER_SETUP_SYMBOLS
(
    LEARNER_SETUP_ID BIGINT not null,
    SYMBOLS_ID       BIGINT not null,
    constraint FK_LEARNER_SETUP_SYMBOLS_SETUP
        foreign key (LEARNER_SETUP_ID) references LEARNER_SETUP,
    constraint FK_LEARNER_SETUP_SYMBOLS_SYMBOL
        foreign key (SYMBOLS_ID) references PARAMETERIZED_SYMBOL
);

create table TEST_EXECUTION_CONFIG
(
    ID               BIGINT GENERATED BY DEFAULT AS identity,
    DRIVER_CONFIG_ID BIGINT not null,
    PROJECT_ID       BIGINT,
    ENVIRONMENT_ID   BIGINT,
    IS_DEFAULT       BOOLEAN,
    DESCRIPTION      TEXT,
    primary key (ID),
    constraint FKDL0WN7MAB0V5PSE0MH2MCO65F
        foreign key (DRIVER_CONFIG_ID) references WEB_DRIVER_CONFIG,
    constraint FKNKPXWGFT1T4B63DJ1DK9SOSIS
        foreign key (PROJECT_ID) references PROJECT,
    constraint FKTESTEXECUTIONCONFIGPROJECTENVIRONMENT
        foreign key (ENVIRONMENT_ID) references PROJECT_ENVIRONMENT
);

create table TEST_EXECUTION_CONFIG_TESTS
(
    TEST_EXECUTION_CONFIG_ID BIGINT not null,
    TESTS_ID                 BIGINT not null,
    constraint FK5I3PCJQ5FMXKJ8XO76UULR2RE
        foreign key (TESTS_ID) references TEST,
    constraint FKC2LHYS0FGPGRXDY8NR8WLXDBV
        foreign key (TEST_EXECUTION_CONFIG_ID) references TEST_EXECUTION_CONFIG
);

