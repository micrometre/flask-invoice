import React, { useState } from 'react';

const InvoiceItem = ({ index, onRemoveItem, value, onChange }) => {
  const { item, quantity, price } = value;

  const handleInputChange = (event) => {
    const { name, value: inputValue } = event.target;
    onChange(index, { ...value, [name]: inputValue });
  };

  return (
    <tr>
      <td>
        <input
          type="text"
          className="form-control"
          name="item"
          value={item}
          onChange={handleInputChange}
          placeholder="Item"
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          name="quantity"
          value={quantity}
          onChange={handleInputChange}
          min="1"
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          name="price"
          value={price}
          onChange={handleInputChange}
          step="0.01"
        />
      </td>
      <td>
        {(quantity * price).toFixed(2)}
      </td>
      <td>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onRemoveItem(index)}
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

const InvoiceForm = () => {
  const [invoiceItems, setInvoiceItems] = useState([]);

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { item: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, updatedItem) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = updatedItem;
    setInvoiceItems(updatedItems);
  };

  const calculateGrandTotal = () => {
    return invoiceItems.reduce((total, item) => {
      return total + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
    }, 0).toFixed(2);
  };

  // Log the invoiceItems whenever it changes
  console.log("Invoice Items:", invoiceItems);

  return (
    <div>
      <h2>Invoice</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item, index) => (
            <InvoiceItem
              key={index}
              index={index}
              value={item}
              onRemoveItem={handleRemoveItem}
              onChange={handleItemChange}
            />
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleAddItem}>
        Add Item
      </button>
      <h3>Grand Total: ${calculateGrandTotal()}</h3>
      <div className="mx-auto ">
      <form className="w-full border-sky-600 bg-red-100">
        <div className="bg-white"> {/* Container */}
          <div className=" w-full">
            <table className="table px-4 min-w-full rounded-md border border-gray-200 overflow-hidden ">
              <thead className="bg-gray-100 ">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Items</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Qty</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Price</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Total</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wide" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="3" className="text-right">
                    <strong>Total:</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
        <div className="flex items-center justify-between">
          <button className="btn btn-primary" onClick={handleAddItem}>
            Add Item
          </button>
        </div>
    </div>
    </div>

  );
};

export default InvoiceForm;