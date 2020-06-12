alter table PUBLIC.user add column username varchar(32) unique;
update PUBLIC.user SET username = 'user' + id;
alter table PUBLIC.user alter column username set not null;