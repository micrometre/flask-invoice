import React, { useState } from 'react';


function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}


function convertToDateString(date) {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}



const ContactForm = () => {
  const [clientAddress, setClientAddress] = useState('')
  const [clientName, setClientName] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [invoiceNumber, setInvoIceNumber] = useState(convertToDateString());
  const [invoiceDate, setInvoiceDate] = useState(getDate());
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', null

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionStatus('pending'); // Indicate submission is in progress
    try {
      const response = await fetch('http://127.0.0.1:5000/', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          invoiceNumber, 
          invoiceDate, 
          fromDate, 
          clientName,
          clientAddress
         }),
      });
      if (!response.ok) {
        const message = `An error occurred: ${response.status}`;
        throw new Error(message);
      }
      const responseData = await response.json(); // Or response.text() if server doesn't return JSON
      console.log('Server response:', responseData);
      window.location.reload();

      setSubmissionStatus('success');
      setInvoIceNumber('');
      setInvoiceDate('');
      setClientName('');
      setClientAddress('');


    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
      setErrors({ submit: 'Failed to submit form. Please try again later.' }); // Generic submit error
    }
  };


  return (
    <div className="d mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Contact Us</h2>
      {submissionStatus === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Thank you for your message.</span>
        </div>
      )}
      {submissionStatus === 'error' && errors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {errors.submit}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="mb-4">
            <label htmlFor="invoice_number" className="block text-gray-700 font-bold mb-2">Invoice number</label>
            <input
              type="text"
              id="invoice_number"
              value={invoiceNumber}
              onChange={(e) => setInvoIceNumber(e.target.invoiceNumber)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="invoice_date" className="block text-gray-700 font-bold mb-2">Invoice date</label>
            <input
              type="text"
              id="invoice_date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.invoiceDate)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="mb-4">
            <label htmlFor="fromDate" className="block text-gray-700 font-bold mb-2">Due date</label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
              id="fromDate"
              name="fromDate"
              type="date"
              autoComplete="off"
              value={
                fromDate.getFullYear().toString() +
                "-" +
                (fromDate.getMonth() + 1).toString().padStart(2, 0) +
                "-" +
                fromDate.getDate().toString().padStart(2, 0)
              }
              onChange={(e) => {
                setFromDate(new Date(e.target.value));
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="client_name" className="block text-gray-700 font-bold mb-2">Client name</label>
            <input
              type="text"
              id="client_name"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="mb-4">
            <label htmlFor="client_address" className="block text-gray-700 font-bold mb-2">Client address</label>
            <input
              type="text"
              id="client_address"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={submissionStatus === 'pending'} // Disable button during submission
          >
            {submissionStatus === 'pending' ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;