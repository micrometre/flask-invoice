# Flask Invoice API

This is a RESTful API built with Flask for managing invoices. It allows you to create, retrieve, update, and delete invoices. The application uses an SQLite database to store invoice data and provides endpoints to interact with this data.

## Features

-   **Create Invoices:** Add new invoices to the database.
-   **Retrieve Invoices:** Get a list of all invoices or fetch a specific invoice by its ID.
-   **Update Invoices:** Modify existing invoice details.
-   **Delete Invoices:** Remove invoices from the database.

## Technologies Used

-   **Flask:** A micro web framework for Python.
-   **SQLite:** A lightweight, file-based database.
-   **Flask-CORS:** A Flask extension for handling Cross-Origin Resource Sharing (CORS).
- **JSON:** A standard format for representing data.

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/micrometre/flask-invoice.git
    cd flask-invoice
    ```

2.  **Create a virtual environment (recommended):**

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Linux/macOS
    venv\Scripts\activate  # On Windows
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```
    ( if you dont have requirements.txt file you can run :
    `pip install Flask Flask-CORS`
    )

4.  **Initialize the database:**

    ```bash
    python init_db.py
    ```

    This will create the `invoices.db` file and set up the necessary table schema.

5.  **Run the application:**

    ```bash
    python app.py
    ```

    The application will start running at `http://127.0.0.1:5000/`.

## API Endpoints

### Create an Invoice (POST /)

-   **Method:** `POST`
-   **Endpoint:** `/`
-   **Request Body (JSON):**

```json
{
  "invoiceItems": [
    {
      "name": "Item 1",
      "quantity": 2,
      "price": 10.00
    },
    {
      "name": "Item 2",
      "quantity": 1,
      "price": 25.50
    }
  ],
  "invoiceDate": "2023-10-27",
  "fromDate": "2023-11-27",
  "clientName": "John Doe",
  "clientAddress": "123 Main St",
  "clientPostcode": "10001",
  "clientEmail": "john.doe@example.com",
  "clientPhone": "555-123-4567",
  "description": "Invoice for services rendered",
  "invoiceNumber": "INV-001",
  "grandTotal": 45.50
}

```
- Response (JSON):

```json
{
  "id": 1,
  "items": 45.50,
  "grandTotal": 45.50
}
```


- Response Codes:
    - 201: Created Successfully
    - 400: Bad Request (if there is a problem in request body)
#### Get All Invoices (GET /)
- Method: GET
- Endpoint: /
- Response (JSON):


```json
[
  {
    "id": 1,
    "items": [
      {
        "name": "Item 1",
        "quantity": 2,
        "price": 10.0
      },
      {
        "name": "Item 2",
        "quantity": 1,
        "price": 25.5
      }
    ],
    "invoiceNumber": "INV-001",
    "invoiceDate": "2023-10-27",
    "invoiceDueDate": "2023-11-27",
    "clientName": "John Doe",
    "clientAddress": "123 Main St",
    "clientPostcode": "10001",
    "clientEmail": "john.doe@example.com",
    "clientPhone": "555-123-4567",
    "description": "Invoice for services rendered",
    "grandTotal": 45.5
  }
]
```
- Response Codes:
    - 200: Ok
### Get Invoice by ID (GET /invoices/<invoice_id>)
- Method: GET
- Endpoint: /invoices/<invoice_id>
- Response (JSON): (same as Get All response when one item in the array)
- Response Codes:
    - 200: Ok
    - 404: Not Found (if invoice not found)
- Update an Invoice (PUT /invoices/<invoice_id>)
- Method: PUT
- Endpoint: /invoices/<invoice_id>
- Request Body (JSON):



```json
{
    "invoiceNumber": "INV-002",
    "invoiceDate": "2023-11-15",
    "invoiceDueDate": "2023-12-15",
    "clientName": "Updated Name",
    "items": [
      {
        "name": "Updated Item",
        "quantity": 3,
        "price": 15.00
      }
    ],
  "grandTotal": 45.0
}
- Response (JSON):
{
  "id": 1,
    "invoice_number": "INV-002",
    "invoice_date": "2023-11-15",
    "invoice_due_date": "2023-12-15",
    "client_name": "Updated Name",
    "items": [
      {
        "name": "Updated Item",
        "quantity": 3,
        "price": 15.00
      }
    ],
  "grandTotal": 45.0
}

```

- Response Codes:
    - 200: Ok
    - 400: Bad Request (if data not valid)
    - 404: Not Found (if invoice not found)

- Delete an Invoice (DELETE /invoices/<invoice_id>)
    - Method: DELETE
    - Endpoint: /invoices/<invoice_id>
    - Response (JSON):
```json

    {
      "message": "Invoice deleted successfully"
    }
    
```

- Response Codes:
    - 200: Ok
    - 404: Not Found (if invoice not found)