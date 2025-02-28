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
    grand_total = float(data['grandTotal'])
    items_json = json.dumps(data['invoiceItems'])

    print(items_json)


    # Insert into the database
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO invoices (items, grand_total)
            VALUES (?, ?)
        ''', (items_json, grand_total))
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
            'grandTotal': invoice['grand_total']
        })

    return jsonify(result)



@app.route("/a", methods=("GET", "POST"))
def invoce_items():
    if request.method == "POST":
        request_data = request.get_json()
        return jsonify(request_data)    
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True) # Set debug=False in production