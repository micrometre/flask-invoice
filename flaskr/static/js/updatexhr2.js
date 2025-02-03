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
  const grandTotalElement = document.getElementById('grandTotal');
  const form = document.getElementById('create-invoice');
  const grand_total = grandTotalElement.value || 0; // Handle potential NaN
  const itemsItem = itemInput.value || 0; // Handle potential NaN
  const quantity = parseFloat(qtyInput.value) || 0; // Handle potential NaN
  const price = parseFloat(priceInput.value) || 0;
  const total = quantity * price;
  totalOutput.textContent = total.toFixed(2); // Format to two decimal places
  console.log(grandTotal)
  const xhr = new XMLHttpRequest();
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://192.168.1.130:5000/create', true); // Replace with your actual endpoint
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log('Request successful:', this.responseText);
      } else if (this.readyState === XMLHttpRequest.DONE) {
        console.error('Request failed:', this.status);
      }
    };

    xhr.send(new FormData(form));
  });

  xhr.open('POST', 'http://192.168.1.130:5000/invoiceitems', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      console.log(xhr.responseText);
    }
  };
  const data = JSON.stringify({ itemsItem: itemsItem, qty: quantity, price: price, total: total, grand_total: grand_total });
  console.log(data)
  xhr.send(data);
  calculateGrandTotal();
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