import { useState } from 'react'
import InvoiceForm from './componnents/InvoiceForm'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <InvoiceForm />
    </>
  )
}

export default App
