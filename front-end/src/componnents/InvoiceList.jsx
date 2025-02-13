import React, { useEffect, useState } from 'react';
import { generatePDF } from '../utils/Pdf';
import "../App.css";
import profileImg from "../assets/images/logo.avif";


const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch invoices from the Flask back-end
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://localhost:5000/');
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data);
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
    <div>
      <h2>Invoice List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Invoice Date</th>
            <th>Due Date</th>
            <th>Client Name</th>
            <th>Client Email</th>
            <th>Client Phone</th>
            <th>Grand Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.invoiceNumber}</td>
              <td>{invoice.invoiceDate}</td>
              <td>{invoice.invoiceDueDate}</td>
              <td>{invoice.clientName}</td>
              <td>{invoice.clientEmail}</td>
              <td>{invoice.clientPhone}</td>
              <td>${invoice.grandTotal.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => alert(`View details for invoice ${invoice.id}`)}
                >
                  View
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