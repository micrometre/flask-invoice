from itertools import count
from flask import Blueprint, json, jsonify
from flask import flash
from flask import g
from flask import redirect
from flask import render_template
from flask import request
from flask import url_for
from werkzeug.exceptions import abort

from .auth import login_required
from .db import get_db

bp = Blueprint("invoice", __name__)
#bp = Blueprint('invoice', __name__, url_prefix='/invoice')


def get_invoice_items(id ):
    post = (
        get_db()
        .execute(
            "SELECT p.id,  item, qty, price, total"
            " FROM invoice_items p JOIN user u ON p.item = u.id"
            " WHERE p.id = ?",
            (id,),
        )
        .fetchone()
    )
    return post


def get_post(id ):
    post = (
        get_db()
        .execute(
            "SELECT p.id, client_name, invoice_date, due_date, invoice_number, description, client_address, client_postcode, client_email, client_phone"
            " FROM invoices p JOIN user u ON p.author_id = u.id"
            " WHERE p.id = ?",
            (id,),
        )
        .fetchone()
    )
    return post

@bp.route("/")
def index():
    db = get_db()
    invoices = db.execute(
        "SELECT p.id, created, author_id, client_name, invoice_date, due_date, invoice_number, description"
        " FROM invoices p JOIN user u ON p.author_id = u.id"
        " ORDER BY created DESC"
    ).fetchall()
    return render_template("invoice/index.html", invoices=invoices)

@bp.route("/<int:id>/view", methods=("GET", "POST"))
@login_required
def create_invoice(id):
    invoice_items = get_invoice_items(id)
    invoices = get_post(id)
    if request.method == "GET":
        db = get_db()
        invoice = db.execute("SELECT * FROM invoices WHERE id = ?", (id,)).fetchone()
        invoice_items = db.execute("SELECT * FROM invoice_items WHERE id = ?", (id,)).fetchone()
    return render_template("invoice/table.html", invoice_items=invoice_items, invoices=invoices)



@bp.route("/invoiceitems", methods=("GET", "POST"))
def put_invoce_items():
    if request.method == "POST":
        request_data = request.get_json()
        itemsItem = request_data["itemsItem"]
        itemsQty = request_data["qty"]
        itemsPrice = request_data["price"]
        itemsTotal = request_data["total"]
        grandTotal = request_data["grand_total"]
        error = None
        if not itemsItem:
            error = "name is required."
        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                "INSERT INTO invoice_items (item, qty, price, total, grand_total) VALUES (?, ?, ?, ?, ?)",
                (itemsItem, itemsQty, itemsPrice, itemsTotal, grandTotal),
            )

            db.commit()
        return jsonify(request_data)    
    return "<p> World!</p>"




@bp.route("/create", methods=("GET", "POST"))
@login_required
def create():
    if request.method == "POST":
        invoice_date = request.form.get('invoice_date')
        due_date = request.form.get('due_date')
        invoice_number = request.form.get('invoice_number')
        description = request.form.get('description')
        client_name = request.form.get('client_name')
        client_address = request.form.get('client_address')
        client_postcode = request.form.get('client_postcode')
        client_email = request.form.get('client_email')
        client_phone = request.form.get('client_phone')
        form_data = request.form
        values_list = list(form_data.values())
        itemes_price = values_list[11]
        #itemes_total = values_list[12]
        error = None
        if not client_name:
            error = "name is required."
        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                "INSERT INTO invoices (author_id, invoice_date, due_date, invoice_number, description,client_name, client_address, client_postcode, client_email, client_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ( g.user["id"], invoice_date, due_date, invoice_number, description, client_name, client_address, client_postcode, client_email, client_phone),
            )

            db.commit()
            return redirect(url_for("invoice.index"))
    return render_template("invoice/create.html")




@bp.route("/<int:id>/update", methods=("GET", "POST"))
@login_required
def update(id):
    invoice_items = get_invoice_items(id)
    invoices = get_post(id)
    if request.method == "POST":
        invoice_date = request.form.get('invoice_date')
        due_date = request.form.get('due_date')
        invoice_number = request.form.get('invoice_number')
        description = request.form.get('description')
        client_name = request.form.get('client_name')
        client_address = request.form.get('client_address')
        client_postcode = request.form.get('client_postcode')
        client_email = request.form.get('client_email')
        client_phone = request.form.get('client_phone')
        itemsItem = request.form.get("item")
        itemsQty = request.form.get("qty")
        itemsPrice = request.form.get("price")
        itemsTotal = request.form.get("total")
        itemsTotal = request.form.get("total")
        itemsGrandTotal = request.form.get("grand_total")
        if not client_name:
            flash = "Title is required."
        else:
            db = get_db()
            db.execute(
                "UPDATE invoices SET invoice_date = ?, due_date = ?, invoice_number = ?, client_name = ?, client_address = ?, client_postcode = ?, client_phone = ?,  description = ? WHERE id = ?" , (invoice_date, due_date, invoice_number, client_name, client_address, client_postcode, client_phone, description, id)
            )

            db.commit()
            return redirect(url_for("invoice.index"))
    return render_template("invoice/update.html", invoices=invoices, invoice_items=invoice_items )


@bp.route("/<int:id>/delete", methods=("POST",))
@login_required
def delete(id):
    get_post(id)
    db = get_db()
    db.execute("DELETE FROM invoices WHERE id = ?", (id,))
    db.commit()
    return redirect(url_for("invoice.index"))