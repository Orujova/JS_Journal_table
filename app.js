const addButton = document.querySelector(".add");
const tbody = document.querySelector("tbody");
let allow = true;
let oldValues = [];

const orderRows = () => {
  const rows = [...document.querySelectorAll("tbody tr")];
  rows.forEach((row, index) => {
    row.querySelector("td").textContent = index + 1;
  });
};

const saveData = (e) => {
  allow = true;
  const inputs = [...document.querySelectorAll("input")];
  const newData = inputs.map((input) => input.value);
  const row = e.target.closest("tr");
  const rowIndex = Array.from(row.parentNode.children).indexOf(row);
  localStorage.setItem(`row-${rowIndex}`, JSON.stringify(newData));
  inputs.forEach((input, key) => {
    const td = input.parentElement;
    td.textContent = newData[key];
  });
  e.target.textContent = "Düzəliş et";
  e.target.classList.remove("save");
  e.target.classList.add("edit");
  e.target.removeEventListener("click", saveData);
  e.target.addEventListener("click", editData);
};

const cancelData = (e) => {
  const inputs = [...document.querySelectorAll("input")];
  inputs.forEach((input, key) => {
    const td = input.parentElement;
    const oldValue = oldValues[key];
    td.textContent = oldValue;
  });
  e.target.textContent = "Sil";
  e.target.removeEventListener("click", cancelData);
  e.target.addEventListener("click", removeData);
  const editBtn = e.target.previousElementSibling;
  editBtn.textContent = "Düzəliş et";
  editBtn.classList.remove("save");
  editBtn.classList.add("edit");
  editBtn.removeEventListener("click", saveData);
  editBtn.addEventListener("click", editData);
};

const removeData = (e) => {
  const row = e.target.closest("tr");
  const rowIndex = Array.from(row.parentNode.children).indexOf(row);
  row.remove();
  allow = true;
  orderRows();
  localStorage.removeItem(`row-${rowIndex}`);
};

const editData = (e) => {
  oldValues.length = 0;
  const cells = [...e.target.closest("tr").querySelectorAll("td")].slice(1, 4);
  cells.forEach((td) => {
    const input = document.createElement("input");
    const oldValue = td.textContent;
    oldValues.push(oldValue);
    input.value = oldValue;
    td.textContent = "";
    td.append(input);
  });
  e.target.textContent = "Yadda saxla";
  e.target.classList.remove("edit");
  e.target.classList.add("save");
  e.target.removeEventListener("click", editData);
  e.target.addEventListener("click", saveData);
  const cancelBtn = e.target.nextElementSibling;
  cancelBtn.textContent = "Ləğv et";
  cancelBtn.removeEventListener("click", removeData);
  cancelBtn.addEventListener("click", cancelData);
};

addButton.addEventListener("click", () => {
  if (!allow) {
    alert("Öncəkini yadda saxla...");
    return;
  }
  allow = false;
  const row = document.createElement("tr");
  const noTd = document.createElement("td");
  noTd.textContent = tbody.children.length + 1;
  const nameTd = createInputCell("text", "Ad");
  const surnameTd = createInputCell("text", "Soyad");
  const ageTd = createInputCell("number", "Yaş");
  const operationsTd = document.createElement("td");
  const saveBtn = createButton("Yadda saxla", "save", saveData);
  const cancelBtn = createButton("Sil", "cancel", removeData);
  operationsTd.append(saveBtn, cancelBtn);
  row.append(noTd, nameTd, surnameTd, ageTd, operationsTd);
  tbody.append(row);
  orderRows();
});

// Helper function to create an input cell
const createInputCell = (type, placeholder) => {
  const td = document.createElement("td");
  const input = document.createElement("input");
  input.setAttribute("type", type);
  input.setAttribute("placeholder", placeholder);
  td.append(input);
  return td;
};

// Helper function to create a button
const createButton = (text, className, clickHandler) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(className);
  button.addEventListener("click", clickHandler);
  return button;
};

// Load data from local storage when the page is loaded
window.addEventListener("load", () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("row-")) {
      const rowData = JSON.parse(localStorage.getItem(key));
      const row = document.createElement("tr");
      const noTd = document.createElement("td");
      noTd.textContent = i + 1;
      const nameTd = createDataCell(rowData[0]);
      const surnameTd = createDataCell(rowData[1]);
      const ageTd = createDataCell(rowData[2]);
      const operationsTd = document.createElement("td");
      const editBtn = createButton("Düzəliş et", "edit", editData);
      const removeBtn = createButton("Sil", "cancel", removeData);
      operationsTd.append(editBtn, removeBtn);
      row.append(noTd, nameTd, surnameTd, ageTd, operationsTd);
      tbody.append(row);
    }
  }
});

// Helper function to create a data cell
const createDataCell = (value) => {
  const td = document.createElement("td");
  td.textContent = value;
  return td;
};
