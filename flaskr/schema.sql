-- Initialize the database.
-- Drop any existing data and create empty tables.

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS providers;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);


CREATE TABLE invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    client_name TEXT NOT NULL,
    client_address TEXT NOT NULL,
    client_postcode TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone INTEGER NOT NULL,
    invoice_date TEXT NOT NULL, 
    due_date TEXT NOT NULL,
    invoice_number TEXT,
    description TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    item TEXT NOT NULL,
    qty INTEGER NOT NULL,
    price REAL NOT NULL,
    total REAL NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);




CREATE TABLE providers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_name TEXT NOT NULL,
  provider_company_name TEXT NOT NULL,
  provider_phone_number INTEGER ,
  provider_email TEXT ,
  provider_address TEXT ,
  provider_postcode TEXT 
);


