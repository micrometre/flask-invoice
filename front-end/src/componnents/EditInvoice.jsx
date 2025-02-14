import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditInvoice = () => {
  const { invoiceId } = useParams(); // Get the invoice ID from the URL
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    invoiceDueDate: '',
    clientName: '',
    clientAddress: '',
    clientPostcode: '',
    clientEmail: '',
    clientPhone: '',
    description: '',
    items: [],
    grandTotal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the invoice data by ID
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`http://localhost:5000/invoices/${invoiceId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch invoice');
        }
        const data = await response.json();
        setInvoice(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  // Handle input changes for top-level fields (e.g., invoiceNumber, invoiceDate, etc.)
  const handleFieldChange = (field, value) => {
    setInvoice({ ...invoice, [field]: value });
  };

  // Handle input changes for items
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index][field] = value;
    setInvoice({ ...invoice, items: updatedItems });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.invoiceDate,
          invoiceDueDate: invoice.invoiceDueDate,
          clientName: invoice.clientName,
          clientAddress: invoice.clientAddress,
          clientPostcode: invoice.clientPostcode,
          clientEmail: invoice.clientEmail,
          clientPhone: invoice.clientPhone,
          description: invoice.description,
          items: invoice.items,
          grandTotal: invoice.grandTotal,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update invoice');
      }

      // Redirect to the invoice list after successful update
      navigate('/invoices');
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading invoice...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Edit Invoice</h2>
      <form onSubmit={handleSubmit}>
        <table className="table px-4 min-w-full rounded-md border border-gray-200 overflow-hidden">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={invoice.invoiceDate}
                  onChange={(e) => handleFieldChange('invoiceDate', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={invoice.invoiceDueDate}
                  onChange={(e) => handleFieldChange('invoiceDueDate', e.target.value)}
                />
              </td>
            </tr>
          </tbody>

          <thead>
            <tr>
              <th>Client Name</th>
              <th>Client Address</th>
              <th>Client Postcode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  value={invoice.clientName}
                  onChange={(e) => handleFieldChange('clientName', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={invoice.clientAddress}
                  onChange={(e) => handleFieldChange('clientAddress', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={invoice.clientPostcode}
                  onChange={(e) => handleFieldChange('clientPostcode', e.target.value)}
                />
              </td>
            </tr>
          </tbody>

          <thead>
            <tr>
              <th>Client Email</th>
              <th>Client Phone</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  value={invoice.clientEmail}
                  onChange={(e) => handleFieldChange('clientEmail', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={invoice.clientPhone}
                  onChange={(e) => handleFieldChange('clientPhone', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={invoice.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                />
              </td>
            </tr>
          </tbody>

          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    step="0.01"
                  />
                </td>
                <td>{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="mb-4">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditInvoice;