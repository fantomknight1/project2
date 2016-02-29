DROP TABLE IF EXISTS users;

CREATE TABLE users (
       id SERIAL UNIQUE PRIMARY KEY,
       codename VARCHAR(255),
       email VARCHAR(255),
       password_digest TEXT
);
