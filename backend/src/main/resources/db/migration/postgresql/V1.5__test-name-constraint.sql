-- Add unique constraint (name, parent_id)
ALTER TABLE test
    ADD CONSTRAINT test_name_parent_id_key
        UNIQUE (name, parent_id);