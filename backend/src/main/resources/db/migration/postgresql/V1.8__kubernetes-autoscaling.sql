alter table "user" drop column SALT;
alter table WEB_DRIVER_CONFIG drop column HEADLESS;
alter table SETTINGS add column RUNTIME varchar(255);
