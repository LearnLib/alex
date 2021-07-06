-- Drop unique name in project constraint
ALTER TABLE symbol
    DROP CONSTRAINT symbol_project_id_name_key;

-- Add new name in group unique constraint
ALTER TABLE symbol
    ADD CONSTRAINT symbol_group_id_name_key
        UNIQUE (group_id, name)