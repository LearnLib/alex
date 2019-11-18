alter table PUBLIC.symbol add column updated_on timestamp not null default now();
alter table PUBLIC.test add column updated_on timestamp not null default now();