const addRowButton = document.getElementById('add-row');
const invoiceItemsTable = document.getElementById('invoice-items');

addRowButton.addEventListener('click', () => {
  const newRow = document.createElement('tr');
  const rowIndex = invoiceItemsTable.rows.length; // Get the current row index

  newRow.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" placeholder="Item" name="item_${rowIndex}" id="item_${rowIndex}"></td>
    <td><input type="number" class="form-control form-control-sm" name="quantity_${rowIndex}" id="qty_${rowIndex}" min="1" value="1" onchange="calculateTotal(${rowIndex})"></td>
    <td><input type="number" class="form-control form-control-sm" name="price_${rowIndex}" id="price_${rowIndex}" step="0.01" value="0.00" onchange="calculateTotal(${rowIndex})"></td>
    <td><output name="result_${rowIndex}" class="form-control form-control-sm" id="total_${rowIndex}"></output></td>
  `;

  invoiceItemsTable.appendChild(newRow);

  calculateTotal(rowIndex); // Calculate total for the new row
});


function calculateTotal(rowIndex) {
  const qtyInput = document.getElementById(`qty_${rowIndex}`);
  const priceInput = document.getElementById(`price_${rowIndex}`);
  const totalOutput = document.getElementById(`total_${rowIndex}`);

  const quantity = parseFloat(qtyInput.value) || 0; // Handle potential NaN
  const price = parseFloat(priceInput.value) || 0;

  const total = quantity * price;
  totalOutput.textContent = total.toFixed(2); // Format to two decimal places

    //Calculate Grand Total
}

