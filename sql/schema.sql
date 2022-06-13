PRAGMA foreign_keys = ON;

CREATE TABLE users
(
    username VARCHAR(20)  NOT NULL PRIMARY KEY,
    email    VARCHAR(40)  NOT NULL,
    password VARCHAR(256) NOT NULL
);

CREATE TABLE data
(
    owner VARCHAR(20) NOT NULL,
    data VARCHAR(1000),
    FOREIGN KEY (owner) REFERENCES users (username) ON DELETE CASCADE
);