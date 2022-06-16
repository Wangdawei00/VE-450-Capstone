PRAGMA foreign_keys = ON;

CREATE TABLE users
(
    email    VARCHAR(40)  NOT NULL PRIMARY KEY,
    password VARCHAR(256) NOT NULL,
    OTP      VARCHAR(10)
);

CREATE TABLE data
(
    owner VARCHAR(20) NOT NULL,
    data VARCHAR(1000),
    FOREIGN KEY (owner) REFERENCES users (email) ON DELETE CASCADE
);