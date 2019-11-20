alter table PUBLIC.user add column username varchar(255) unique;
update PUBLIC.user SET username = id;
alter table PUBLIC.user alter column username set not null;