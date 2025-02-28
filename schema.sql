-- Initialize the database.
-- Drop any existing data and create empty tables.

DROP TABLE IF EXISTS invoices;


CREATE TABLE invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT NOT NULL,
    invoice_date TEXT NOT NULL, 
    invoice_due_date TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_address TEXT NOT NULL,
    client_postcode TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone INTEGER NOT NULL,
    description TEXT,
    items TEXT NOT NULL,
    grand_total REAL NOT NULL
);