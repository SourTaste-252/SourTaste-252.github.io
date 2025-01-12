// Import the arrays from the module
import { laws, descriptions, numbers } from './laws_data.js';

// Reference to table body
const tableBody = document.getElementById('table-body');

// Loop through the arrays and create rows
for (let i = 0; i < laws.length; i++) {
    // Create a new row
    const row = document.createElement('tr');

    // Create and append cells
    const codeCell = document.createElement('td');
    codeCell.textContent = numbers[i];
    row.appendChild(codeCell);

    const lawCell = document.createElement('td');
    lawCell.textContent = laws[i];
    row.appendChild(lawCell);

    const descCell = document.createElement('td');
    descCell.textContent = descriptions[i];
    row.appendChild(descCell);

    // Append the row to the table body
    tableBody.appendChild(row);
}
