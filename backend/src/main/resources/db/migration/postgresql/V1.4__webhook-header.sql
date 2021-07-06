-- Add header field to webhooks
ALTER TABLE webhook
    ADD COLUMN headers bytea;

-- Add request method to webhooks
ALTER TABLE webhook
    ADD COLUMN method integer;

-- Add onetime indicator to webhooks
ALTER TABLE webhook
    ADD COLUMN once boolean;

-- Update webhooks
UPDATE webhook
    SET method = 1;

UPDATE webhook
    SET once = false;

-- Set constraints
ALTER TABLE webhook
    ALTER COLUMN method SET NOT NULL;

ALTER TABLE webhook
    ALTER COLUMN once SET NOT NULL;