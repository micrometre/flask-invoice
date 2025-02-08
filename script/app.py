from flask import Flask, request, jsonify
from flask_cors import CORS  # Enable Cross-Origin Resource Sharing

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes (or configure specifically)

invoices = []  # In-memory storage (replace with a database later)

@app.route('/invoices', methods=['GET'])
def get_invoices():
    return jsonify(invoices)

@app.route('/invoices', methods=['POST'])
def create_invoice():
    data = request.get_json()
    # Validate data (e.g., required fields, data types)
    if not all(key in data for key in ('clientName', 'items', 'total')):
        return jsonify({'error': 'Missing required fields'}), 400

    new_invoice = {
        'id': len(invoices) + 1,  # Simple ID generation (use UUID in production)
        'clientName': data['clientName'],
        'items': data['items'],  # Example: [{'description': 'Service 1', 'quantity': 2, 'price': 100}, ...]
        'total': data['total'],
        # ... other invoice details
    }
    invoices.append(new_invoice)
    return jsonify(new_invoice), 201  # 201 Created

@app.route('/invoices/<int:invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    for invoice in invoices:
        if invoice['id'] == invoice_id:
            return jsonify(invoice)
    return jsonify({'error': 'Invoice not found'}), 404

# ... other endpoints (PUT for updating, DELETE)

if __name__ == '__main__':
    app.run(debug=True) # Set debug=False in production