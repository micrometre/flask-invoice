const convertToDateString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const convertToDateTimeLocalString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
const currentTime = new Date()
document.getElementById('invoice_number').value = convertToDateTimeLocalString(currentTime)
document.getElementById('invoice_date').value = convertToDateString(currentTime)
const form = document.getElementById("create-invoice");
const qty_1 = form.elements["qty_1"];
const price_1 = form.elements["price_1"];
const result = form.elements["result_1"];
function updateResult() {
  const aValue = parseInt(qty_1.value);
  const bValue = parseInt(price_1.value);
  result.value = aValue + bValue;
}
form.addEventListener("input", updateResult);
updateResult();



