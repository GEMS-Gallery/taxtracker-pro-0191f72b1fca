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
            <button class="edit-btn" data-tid="${taxPayer.tid}">Edit</button>
            <button class="delete-btn" data-tid="${taxPayer.tid}">Delete</button>
        `;
        taxPayerList.appendChild(div);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editTaxPayer);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTaxPayer);
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

// Function to delete a tax payer
async function deleteTaxPayer(e) {
    const tid = e.target.getAttribute('data-tid');
    if (confirm(`Are you sure you want to delete the tax payer with TID: ${tid}?`)) {
        const result = await backend.deleteTaxPayer(tid);
        if (result) {
            alert('TaxPayer deleted successfully!');
            displayTaxPayers();
        } else {
            alert('Failed to delete TaxPayer. Please try again.');
        }
    }
}

// Function to edit a tax payer
async function editTaxPayer(e) {
    const tid = e.target.getAttribute('data-tid');
    const taxPayer = await backend.searchTaxPayer(tid);
    if (taxPayer) {
        document.getElementById('editTid').value = taxPayer.tid;
        document.getElementById('editFirstName').value = taxPayer.firstName;
        document.getElementById('editLastName').value = taxPayer.lastName;
        document.getElementById('editAddress').value = taxPayer.address;
        document.getElementById('editModal').style.display = 'block';
    } else {
        alert('Failed to load TaxPayer information. Please try again.');
    }
}

// Function to update a tax payer
document.getElementById('editTaxPayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tid = document.getElementById('editTid').value;
    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;
    const address = document.getElementById('editAddress').value;

    const result = await backend.updateTaxPayer(tid, firstName, lastName, address);
    if (result) {
        alert('TaxPayer updated successfully!');
        document.getElementById('editModal').style.display = 'none';
        displayTaxPayers();
    } else {
        alert('Failed to update TaxPayer. Please try again.');
    }
});

// Close modal when clicking on <span> (x)
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target == document.getElementById('editModal')) {
        document.getElementById('editModal').style.display = 'none';
    }
});

// Initial display of tax payers
displayTaxPayers();