import { backend } from 'declarations/backend';

// Function to display all tax payers
async function displayTaxPayers() {
    const taxPayers = await backend.getAllTaxPayers();
    const taxPayerList = document.getElementById('taxPayerList');
    taxPayerList.innerHTML = '';

    taxPayers.forEach(taxPayer => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p><strong>TID:</strong> ${taxPayer.tid}</p>
            <p><strong>Name:</strong> ${taxPayer.firstName} ${taxPayer.lastName}</p>
            <p><strong>Address:</strong> ${taxPayer.address}</p>
            <hr>
        `;
        taxPayerList.appendChild(div);
    });
}

// Function to add a new tax payer
document.getElementById('addTaxPayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tid = document.getElementById('tid').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;

    await backend.addTaxPayer(tid, firstName, lastName, address);
    alert('TaxPayer added successfully!');
    e.target.reset();
    displayTaxPayers();
});

// Function to search for a tax payer
document.getElementById('searchTaxPayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTid = document.getElementById('searchTid').value;
    const result = await backend.searchTaxPayer(searchTid);
    const searchResult = document.getElementById('searchResult');

    if (result) {
        searchResult.innerHTML = `
            <h3>Search Result:</h3>
            <p><strong>TID:</strong> ${result.tid}</p>
            <p><strong>Name:</strong> ${result.firstName} ${result.lastName}</p>
            <p><strong>Address:</strong> ${result.address}</p>
        `;
    } else {
        searchResult.innerHTML = '<p>No TaxPayer found with the given TID.</p>';
    }
});

// Initial display of tax payers
displayTaxPayers();