--------------- MESSAGE CONTENT LENGTH BY USER ---------------

-- TABLE --

CREATE TABLE IF NOT EXISTS messages_content_length (
    -- RELATIONSHIPS
    chat_id UUID NOT NULL,
    user_id UUID NOT NULL,

    -- METADATA
    content_length INT DEFAULT 0,

    -- PRIMARY KEY
    PRIMARY KEY (chat_id, user_id)
);

-- FUNCTION --

CREATE OR REPLACE FUNCTION update_messages_content_length()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent null chat_id or user_id from triggering the function
    IF NEW.chat_id IS NULL OR NEW.user_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Update or insert the content length for the (chat_id, user_id) pair
    INSERT INTO messages_content_length (chat_id, user_id, content_length)
    VALUES (NEW.chat_id, NEW.user_id, (
        SELECT COALESCE(SUM(LENGTH(content)), 0)
        FROM messages
        WHERE chat_id = NEW.chat_id AND user_id = NEW.user_id
    ))
    ON CONFLICT (chat_id, user_id)
    DO UPDATE SET content_length = EXCLUDED.content_length;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER --

CREATE TRIGGER trigger_update_content_length
AFTER INSERT OR UPDATE OR DELETE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_messages_content_length();
