PRAGMA foreign_keys = ON;

CREATE TABLE users
(
    email    VARCHAR(40)  NOT NULL PRIMARY KEY,
    password VARCHAR(256),
    OTP      VARCHAR(10)
);

CREATE TABLE data
(
    owner VARCHAR(20) NOT NULL PRIMARY KEY ,
    class INTEGER NOT NULL,
    xdata TEXT,
    ydata TEXT,
    type INTEGER NOT NULL, -- 0 negative, 1 positive, 2 unknown
    flipped VARCHAR(20) NOT NULL -- 0 means obj image is on the left
);