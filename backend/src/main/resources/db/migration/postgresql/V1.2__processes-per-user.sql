-- Add max allowed processes to user
ALTER TABLE "user"
    ADD COLUMN max_allowed_processes INTEGER DEFAULT 1;

-- Populate new column with default values on exiting rows
-- noinspection SqlWithoutWhere
UPDATE "user"
SET max_allowed_processes = 1;

-- Add not null constraint
ALTER TABLE "user"
    ALTER COLUMN max_allowed_processes SET NOT NULL;