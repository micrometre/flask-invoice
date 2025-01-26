-- Initialize the database.
-- Drop any existing data and create empty tables.

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS forms;
DROP TABLE IF EXISTS invoices;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);


CREATE TABLE invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    client_name TEXT NOT NULL,
    invoice_date TEXT NOT NULL, 
    due_date TEXT NOT NULL,
    invoice_number TEXT,
    description TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

);