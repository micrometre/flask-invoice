import os
import sqlite3
from flask import Flask, abort, json, jsonify, render_template, request, url_for, flash, redirect
from flask_cors import CORS




app = Flask(__name__)

CORS(app)
DATABASE = 'invoices.db'

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                items TEXT NOT NULL,
                grand_total REAL NOT NULL
            )
        ''')
        conn.commit()

# Helper function to get a database connection
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn


def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Save an invoice
@app.route('/', methods=['POST'])
def save_invoice():
    data = request.get_json()
    items_json = json.dumps(data['invoiceItems'])
    invoice_date = data['invoiceDate']
    invoice_due_date = data['fromDate']
    client_name = data['clientName']
    client_address = data['clientAddress']    
    client_postcode = data['clientPostcode']
    client_email = data['clientEmail']
    client_phone = data['clientPhone']
    description = data['description']
    invoice_number = data['invoiceNumber']
    grand_total = float(data['grandTotal'])
    print(data)

    # Insert into the database
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO invoices (invoice_number, invoice_date, invoice_due_date, client_name, client_address, client_postcode, client_email, client_phone, description, items, grand_total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
        ''', ( invoice_number, invoice_date, invoice_due_date, client_name, client_address, client_postcode, client_email, client_phone, description, items_json, grand_total))
        conn.commit()

        # Get the ID of the newly created invoice
        invoice_id = cursor.lastrowid

    # Return the saved invoice
    return jsonify({
        'id': invoice_id,
        'items': grand_total,
        'grandTotal': grand_total
    }), 201


@app.route('/', methods=['GET'])
def get_invoices():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM invoices')
        invoices = cursor.fetchall()

    # Convert items from JSON string to Python list
    result = []
    for invoice in invoices:
        result.append({
            'id': invoice['id'],
            'items': json.loads(invoice['items']),
            'invoiceNumber': invoice['invoice_number'],
            'invoiceDate': invoice['invoice_date'],
            'invoiceDueDate': invoice['invoice_due_date'],
            'clientName' : invoice['client_name'],
            'clientAddress' : invoice['client_address'],
            'clientPostcode' : invoice['client_postcode'],
            'clientEmail': invoice['client_email'],
            'clientPhone' : invoice['client_phone'],
            'description' : invoice['description'],
            'grandTotal': invoice['grand_total'],
        })

    return jsonify(result)






# Update an invoice by ID
@app.route('/invoices/<int:invoice_id>', methods=['PUT'])
def update_invoice(invoice_id):
    data = request.get_json()
    print(data)
    if not  data:
        abort(400, description="Invalid invoice data")
    # Convert items to JSON string
    items_json = json.dumps(data['items'])
    grand_total = float(data['grandTotal'])
    invoice_number = data['invoiceNumber']
    invoice_date = data['invoiceDate']
    invoice_due_date = data['invoiceDueDate']
    client_name = data['clientName']


    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE invoices
            SET   invoice_number = ?, invoice_date = ?, invoice_due_date = ?, client_name = ?, items = ?, grand_total = ?
            WHERE id = ?
        ''', (invoice_number, invoice_date, invoice_due_date, client_name,  items_json, grand_total, invoice_id))
        conn.commit()

        if cursor.rowcount == 0:
            abort(404, description="Invoice not found")

    # Return the updated invoice
    return jsonify({
        'id': invoice_id,
        'invoice_number': invoice_number,
        'invoice_date': invoice_date,
        'invoice_due_date': invoice_due_date,
        'client_name' : client_name,
        'items': data['items'],
        'grandTotal': grand_total,
    })


# Fetch a specific invoice by ID
@app.route('/invoices/<int:invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM invoices WHERE id = ?', (invoice_id,))
        invoice = cursor.fetchone()

    if not invoice:
        abort(404, description="Invoice not found")

    # Convert items from JSON string to Python list
    return jsonify({
        'id': invoice['id'],
        'invoiceNumber': invoice['invoice_number'],
        'invoiceDate': invoice['invoice_date'],
        'invoiceDueDate': invoice['invoice_due_date'],
        'clientName' : invoice['client_name'],
        'client_address' : invoice['client_address'],
        'clientPostcode' : invoice['client_postcode'],
        'clientEmail': invoice['client_email'],
        'clientPhone' : invoice['client_phone'],
        'description' : invoice['description'],
        'items': json.loads(invoice['items']),
        'grandTotal': invoice['grand_total'],
    })





# Delete an invoice by ID
@app.route('/invoices/<int:invoice_id>', methods=['DELETE'])
def delete_invoice(invoice_id):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM invoices WHERE id = ?', (invoice_id,))
        conn.commit()

    if cursor.rowcount == 0:
        abort(404, description="Invoice not found")

    return jsonify({'message': 'Invoice deleted successfully'}), 200



@app.route("/a", methods=("GET", "POST"))
def invoce_items():
    if request.method == "POST":
        request_data = request.get_json()
        return jsonify(request_data)    
    return render_template("index.html")

init_db()


if __name__ == '__main__':
    app.run(debug=True) # Set debug=False in production