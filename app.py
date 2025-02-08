import os
import sqlite3
from flask import Flask, jsonify, render_template, request, url_for, flash, redirect
from flask_cors import CORS




app = Flask(__name__)

CORS(app)
app.config['SECRET_KEY'] = '705e2337c0a49c2ed160e600ed3556a5ac3e06929babafee'




def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn



@app.route("/", methods=("GET", "POST"))
def put_invoce_items():
    if request.method == "POST":
        request_data = request.get_json()
        invoice_number = request_data['invoiceNumber']
        invoice_due_date = request_data['fromDate']
        invoice_date = request_data['invoiceDate']
        print(invoice_due_date)
        if not invoice_number:
            flash('Title is required!')
        elif not invoice_date:
            flash('Content is required!')
        else:
            conn = get_db_connection()
            conn.execute('INSERT INTO posts (title, content) VALUES (?, ?)',
                         (invoice_number, invoice_due_date))
            conn.commit()
            conn.close()

        print(invoice_date)
        return jsonify(request_data)    
    return render_template("index.html")






if __name__ == '__main__':
     app.run(debug=True) # Set debug=False in production