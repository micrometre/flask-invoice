from flask import Blueprint
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
    print(invoices)
    return render_template("invoice/index.html", invoices=invoices)


def get_post(id ):
    post = (
        get_db()
        .execute(
            "SELECT p.id, client_name, invoice_date, due_date, invoice_number, description"
            " FROM invoices p JOIN user u ON p.author_id = u.id"
            " WHERE p.id = ?",
            (id,),
        )
        .fetchone()
    )
    return post


@bp.route("/create", methods=("GET", "POST"))
@login_required
def create():
    if request.method == "POST":
        client_name = request.form.get('client_name')
        invoice_date = request.form.get('invoice_date')
        due_date = request.form.get('due_date')
        invoice_number = request.form.get('invoice_number')
        description = request.form.get('description')
        error = None
        if not client_name:
            error = "Title is required."

        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                "INSERT INTO invoices (author_id, client_name, invoice_date, due_date, invoice_number, description) VALUES (?, ?, ?, ?, ?, ?)",
                ( g.user["id"], client_name, invoice_date, due_date, invoice_number, description),
            )
            db.commit()
            return redirect(url_for("invoice.index"))
    return render_template("invoice/create.html")


@bp.route("/<int:id>/update", methods=("GET", "POST"))
@login_required
def update(id):
    invoices = get_post(id)
    if request.method == "POST":
        client_name = request.form.get('client_name')
        invoice_date = request.form.get('invoice_date')
        due_date = request.form.get('due_date')
        invoice_number = request.form.get('invoice_number')
        description = request.form.get('description')
        error = None
        if not client_name:
            error = "Title is required."
        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                "UPDATE invoices SET client_name = ?, description = ? WHERE id = ?", (client_name, description, id)
            )
            db.commit()
            return redirect(url_for("invoice.index"))
    return render_template("invoice/update.html", invoices=invoices)


@bp.route("/<int:id>/delete", methods=("POST",))
@login_required
def delete(id):
    get_post(id)
    db = get_db()
    db.execute("DELETE FROM invoice WHERE id = ?", (id,))
    db.commit()
    return redirect(url_for("invoice.index"))