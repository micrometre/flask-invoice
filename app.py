from flask import Flask, json, flash, jsonify, redirect, render_template, request, url_for
from flask_cors import CORS
import logging
import pandas as pd
import time

app = Flask(__name__)
CORS(app)

logging.getLogger('flask_cors').level = logging.DEBUG





@app.route("/", methods=("GET", "POST"))
def put_invoce_items():
    if request.method == "POST":
        request_data = request.get_json()
        print(request_data)
        return jsonify(request_data)    
    return render_template("index.html")



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)