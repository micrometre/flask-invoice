const addRowButton = document.getElementById('add-row');
const invoiceItemsTable = document.getElementById('invoice-items');

addRowButton.addEventListener('click', () => {
  const newRow = document.createElement('tr');
  const rowIndex = invoiceItemsTable.rows.length; // Get the current row index
  newRow.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" placeholder="Item" name="item_${rowIndex}" id="item_${rowIndex}" value="item_${rowIndex}" ></td>
    <td><input type="number" class="form-control form-control-sm" name="qty_${rowIndex}" id="qty_${rowIndex}" min="1" value="1" onchange="calculateTotal(${rowIndex})"></td>
    <td><input type="number" class="form-control form-control-sm" name="price_${rowIndex}" id="price_${rowIndex}" step="0.01" value="0.00" onchange="calculateTotal(${rowIndex})"></td>
    <td><output name="result_${rowIndex}" class="form-control form-control-sm" id="total_${rowIndex}"></output></td>
  `;
  invoiceItemsTable.appendChild(newRow);
});



function calculateTotal(rowIndex) {
  const itemInput = document.getElementById(`item_${rowIndex}`);
  const qtyInput = document.getElementById(`qty_${rowIndex}`);
  const priceInput = document.getElementById(`price_${rowIndex}`);
  const totalOutput = document.getElementById(`total_${rowIndex}`);
  const itemsItem = itemInput.value || 0; // Handle potential NaN
  const quantity = parseFloat(qtyInput.value) || 0; // Handle potential NaN
  const price = parseFloat(priceInput.value) || 0;
  const total = quantity * price;
  totalOutput.textContent = total.toFixed(2); // Format to two decimal places
  console.log(itemsItem)
  console.log(quantity)
  console.log(price)
  console.log(total)
  sendForm()
  calculateGrandTotal();
}



function sendForm() {
  // 1. Create a new XMLHttpRequest instance
const xhr = new XMLHttpRequest();

// 2. Define the request method and URL
xhr.open('POST', 'http://192.168.1.130:5000/test', true);

// 3. Set request headers (if needed)
xhr.setRequestHeader('Content-Type', 'application/json');

// 4. Define the response handler
xhr.onreadystatechange = function() {
  if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    // Handle the server response
    console.log(xhr.responseText);
  }
};

// 5. Send the request with data payload
const data = JSON.stringify({ name: 'John Doe', email: 'john@example.com' });
xhr.send(data);
}


function calculateGrandTotal() {
  let grandTotal = 0;
  const rows = invoiceItemsTable.rows;
  for (let i = 1; i < rows.length; i++) { // Start from index 1 to skip header row
    const rowTotalElement = rows[i].querySelector('[id^="total_"]');
    const rowTotal = parseFloat(rowTotalElement.textContent) || 0;
    grandTotal += rowTotal;
  }
  const grandTotalElement = document.getElementById('grandTotal');
  document.getElementById('grandTotal').value = grandTotal

  //grandTotalElement.textContent = grandTotal.toFixed(2);

}