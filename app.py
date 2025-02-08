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


@app.route('/post')
def index():
    conn = get_db_connection()
    posts = conn.execute('SELECT * FROM posts').fetchall()
    conn.close()
    return render_template('test.html', posts=posts)


@app.route("/", methods=("GET", "POST"))
def put_invoce_items():
    if request.method == "POST":
        request_data = request.get_json()
        invoiceNumber = request_data['invoiceNumber']
        print(invoiceNumber)
        return jsonify(request_data)    
    return render_template("index.html")



@app.route('/create/', methods=('GET', 'POST'))
def create():
    if request.method == 'POST':
        request_data = request.get_json()
        title = request.form['title']
        content = request.form['content']

        if not title:
            flash('Title is required!')
        elif not content:
            flash('Content is required!')
        else:
            conn = get_db_connection()
            conn.execute('INSERT INTO posts (title, content) VALUES (?, ?)',
                         (title, content))
            conn.commit()
            conn.close()
            return redirect(url_for('index'))
    
    return render_template('create.html')


if __name__ == '__main__':
     app.run(debug=True) # Set debug=False in production