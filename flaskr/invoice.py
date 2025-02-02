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





@bp.route("/")
def index():
    db = get_db()
    invoices = db.execute(
        "SELECT p.id, created, author_id, client_name, invoice_date, due_date, invoice_number, description"
        " FROM invoices p JOIN user u ON p.author_id = u.id"
        " ORDER BY created DESC"
    ).fetchall()
    return render_template("invoice/index.html", invoices=invoices)


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




@bp.route("/<int:id>/view", methods=("GET", "POST"))
@login_required
def create_invoice(id):
    invoices = get_post(id)
    if request.method == "GET":
        db = get_db()
        invoice = db.execute("SELECT * FROM invoices WHERE id = ?", (id,)).fetchone()
    print(invoice)
    return render_template("invoice/view.html", invoices=invoices)

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
        itemes_item = request.form.get('item')
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
        if not client_name:
            flash = "Title is required."
        else:
            db = get_db()
            db.execute(
                "UPDATE invoices SET invoice_date = ?, due_date = ?, invoice_number = ?, client_name = ?, client_address = ?, client_postcode = ?, description = ? WHERE id = ?" , (invoice_date, due_date, invoice_number, client_name, client_address, client_postcode, description, id)
            )
            db.commit()
            return redirect(url_for("invoice.index"))
    return render_template("invoice/update.html", invoices=invoices)


@bp.route("/<int:id>/delete", methods=("POST",))
@login_required
def delete(id):
    get_post(id)
    db = get_db()
    db.execute("DELETE FROM invoices WHERE id = ?", (id,))
    db.commit()
    return redirect(url_for("invoice.index"))