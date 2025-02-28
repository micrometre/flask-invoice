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
        print(client_name)
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
     app.run(debug=True) # Set debug=False in production