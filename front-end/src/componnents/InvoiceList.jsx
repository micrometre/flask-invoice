import React, { useEffect, useState } from 'react';
import "../App.css";

import { useParams, useNavigate } from 'react-router-dom';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  // Fetch invoices from the Flask back-end
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://192.168.1.130:5000');
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data);
        console.log(data)
        navigate('/invoices');

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return <div>Loading invoices...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-md shadow-md">

      <h2>Invoice List</h2>
      <table className="table px-4 min-w-full rounded-md border border-gray-200 overflow-hidden ">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Client Post Code</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.clientName}</td>
              <td>{invoice.clientPostcode}</td>
              <td>${invoice.grandTotal.toFixed(2)}</td>
              <td>

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                >
                  Edit
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default InvoiceList;