import os
from flask import Flask, json, flash, jsonify, redirect, render_template, request, session, url_for
from flask_cors import CORS
import logging
import pandas as pd
import sqlite3
from flask import g




app = Flask(__name__)
CORS(app)

logging.getLogger('flask_cors').level = logging.DEBUG


DATABASE = 'database.db'
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()




@app.route("/", methods=("GET", "POST"))
def put_invoce_items():
    cur = get_db().cursor()
    init_db()
    if request.method == "POST":
        user_id = session.get('user_id')

        request_data = request.get_json()
        print(request_data)
        return jsonify(request_data)    
    return render_template("index.html")



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)