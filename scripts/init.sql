CREATE database "users-db";
CREATE database "orders-db";

\c users-db

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    field1 VARCHAR(20) DEFAULT NULL,
    field2 VARCHAR(20) DEFAULT NULL,
    field3 VARCHAR(20) DEFAULT NULL,
    field4 VARCHAR(20) DEFAULT NULL,
    field5 VARCHAR(20) DEFAULT NULL,
    field6 VARCHAR(20) DEFAULT NULL,
    field7 VARCHAR(20) DEFAULT NULL,
    field8 VARCHAR(20) DEFAULT NULL,
    field9 VARCHAR(20) DEFAULT NULL,
    field10 VARCHAR(20) DEFAULT NULL,
    field11 VARCHAR(20) DEFAULT NULL,
    field12 VARCHAR(20) DEFAULT NULL,
    field13 VARCHAR(20) DEFAULT NULL,
    field14 VARCHAR(20) DEFAULT NULL,
    field15 VARCHAR(20) DEFAULT NULL,
    field16 VARCHAR(20) DEFAULT NULL,
    field17 VARCHAR(20) DEFAULT NULL,
    field18 VARCHAR(20) DEFAULT NULL,
    field19 VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email)
SELECT 
    'User ' || i, 
    'user' || i || '@example.com'
FROM generate_series(1, 1000) AS i;


CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\c orders-db

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
