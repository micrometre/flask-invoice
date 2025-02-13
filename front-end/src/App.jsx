import { useState } from 'react'
import InvoiceForm from './componnents/InvoiceForm'
import InvoiceList from './componnents/InvoiceList'
import Card from './componnents/Card'
import { generatePDF } from './utils/Pdf'



function App() {

  return (
    <>
          <InvoiceList />
    </>
  )
}

export default App
