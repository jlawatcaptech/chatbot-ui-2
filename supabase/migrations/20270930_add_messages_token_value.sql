-- TABLE --

CREATE TABLE IF NOT EXISTS messages_token_value (
    -- RELATIONSHIPS
    chat_id UUID NOT NULL,

    -- METADATA
    token_value INT DEFAULT 0,

    -- PRIMARY KEY
    PRIMARY KEY (chat_id)
);