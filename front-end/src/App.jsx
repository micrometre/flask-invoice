import { useState } from 'react'
import InvoiceForm from './componnents/InvoiceForm'
import InvoiceList from './componnents/InvoiceList'
function App() {

  return (
    <>
      <InvoiceList />
      <InvoiceForm />
    </>
  )
}

export default App
