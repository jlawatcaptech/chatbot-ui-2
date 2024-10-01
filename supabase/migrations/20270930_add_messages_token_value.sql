-- TABLE --

CREATE TABLE IF NOT EXISTS messages_token_value (
    -- RELATIONSHIPS
    chat_id UUID NOT NULL,

    -- METADATA
    token_value INT DEFAULT 0,

    -- PRIMARY KEY
    PRIMARY KEY (chat_id)
);

-- Enable Row-Level Security (RLS) --
ALTER TABLE messages_token_value ENABLE ROW LEVEL SECURITY;

-- Policy to allow all authenticated users to access the table --
CREATE POLICY allow_authenticated_access
ON messages_token_value
FOR ALL
USING (auth.role() = 'authenticated');
