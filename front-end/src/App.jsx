import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvoiceList from './componnents/InvoiceList';
import EditInvoice from './componnents/EditInvoice';
import InvoiceForm from './componnents/InvoiceForm';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InvoiceForm  />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/:invoiceId/edit" element={<EditInvoice />} />
      </Routes>
    </Router>
  );
}

export default App;