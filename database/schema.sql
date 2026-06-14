CREATE TABLE journals (
    id UUID PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    description TEXT NOT NULL,

    image_url TEXT NOT NULL,

    image_key TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL
);