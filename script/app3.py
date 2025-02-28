import os
import sqlite3
from flask import Flask, jsonify, render_template, request, url_for, flash, redirect
from flask_cors import CORS




app = Flask(__name__)

CORS(app)




def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/", methods=("GET", "POST"))
def invoce_items():
    if request.method == "POST":
        request_data = request.get_json()
        print(request_data)
        return jsonify(request_data)    
    return render_template("index.html")







@app.route("/a", methods=("GET", "POST"))
def put_invoce_items():
    if request.method == "POST":
        request_data = request.get_json()
        invoice_number = request_data['invoiceNumber']
        invoice_date = request_data['invoiceDate']
        invoice_due_date = request_data['fromDate']
        client_name = request_data['clientName']
        client_address = request_data['clientAddress']    
        client_postcode = request_data['clientPostcode']
        client_email = request_data['clientEmail']
        client_phone = request_data['clientPhone']
        description = request_data['description']
        print(request_data)
        if not invoice_number:
            flash('Title is required!')
        elif not invoice_date:
            flash('Content is required!')
        else:
            conn = get_db_connection()
            conn.execute('INSERT INTO invoices (invoice_number, invoice_date, invoice_due_date, client_name, client_address, client_postcode, client_email, client_phone, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )',
                         (invoice_number, invoice_date, invoice_due_date, client_name, client_address, client_postcode, client_email, client_phone, description))
            conn.commit()
            conn.close()

        print(invoice_date)
        return jsonify(request_data)    
    return render_template("index.html")






if __name__ == '__main__':
     app.run(debug=True) # Set debug=False in productionfrom flask import Flask, jsonify, request, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# In-memory storage for invoices
invoices = []

# Helper function to find an invoice by ID
def find_invoice(invoice_id):
    return next((invoice for invoice in invoices if invoice['id'] == invoice_id), None

# Generate a unique ID for new invoices
def generate_id():
    return max([invoice['id'] for invoice in invoices], default=0) + 1

# Save an invoice
@app.route('/api/invoices', methods=['POST'])
def save_invoice():
    data = request.get_json()
    if not data or 'items' not in data or 'grandTotal' not in data:
        abort(400, description="Invalid invoice data")

    # Create a new invoice
    new_invoice = {
        'id': generate_id(),
        'items': data['items'],
        'grandTotal': data['grandTotal']
    }
    invoices.append(new_invoice)

    return jsonify(new_invoice), 201

# Fetch all invoices
@app.route('/api/invoices', methods=['GET'])
def get_invoices():
    return jsonify(invoices)

# Fetch a specific invoice by ID
@app.route('/api/invoices/<int:invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    invoice = find_invoice(invoice_id)
    if not invoice:
        abort(404, description="Invoice not found")
    return jsonify(invoice)

# Delete an invoice by ID
@app.route('/api/invoices/<int:invoice_id>', methods=['DELETE'])
def delete_invoice(invoice_id):
    global invoices
    invoice = find_invoice(invoice_id)
    if not invoice:
        abort(404, description="Invoice not found")

    invoices = [inv for inv in invoices if inv['id'] != invoice_id]
    return jsonify({'message': 'Invoice deleted successfully'}), 200

# Error handler for 404
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': str(error)}), 404

# Error handler for 400
@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': str(error)}), 400

if __name__ == '__main__':
    app.run(debug=True)