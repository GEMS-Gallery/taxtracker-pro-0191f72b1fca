import { backend } from 'declarations/backend';

// Helper function to trim spaces
function trim(str) {
    return str.trim();
}

// Function to display all tax payers
async function displayTaxPayers() {
    try {
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
    } catch (error) {
        console.error('Error displaying tax payers:', error);
        alert('Failed to load tax payers. Please try again.');
    }
}

// Function to add a new tax payer
document.getElementById('addTaxPayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tid = trim(document.getElementById('tid').value);
    const firstName = trim(document.getElementById('firstName').value);
    const lastName = trim(document.getElementById('lastName').value);
    const address = trim(document.getElementById('address').value);

    try {
        await backend.addTaxPayer(tid, firstName, lastName, address);
        alert('TaxPayer added successfully!');
        e.target.reset();
        displayTaxPayers();
    } catch (error) {
        console.error('Error adding tax payer:', error);
        alert('Failed to add tax payer. Please try again.');
    }
});

// Function to search for a tax payer
document.getElementById('searchTaxPayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTid = trim(document.getElementById('searchTid').value);
    try {
        const result = await backend.searchTaxPayer(searchTid);
        const searchResult = document.getElementById('searchResult');

        if (result && result.length > 0) {
            const taxPayer = result[0];
            searchResult.innerHTML = `
                <h3>Search Result:</h3>
                <p><strong>TID:</strong> ${taxPayer.tid}</p>
                <p><strong>Name:</strong> ${taxPayer.firstName} ${taxPayer.lastName}</p>
                <p><strong>Address:</strong> ${taxPayer.address}</p>
            `;
        } else {
            searchResult.innerHTML = '<p>No TaxPayer found with the given TID.</p>';
        }
    } catch (error) {
        console.error('Error searching for tax payer:', error);
        alert('Failed to search for tax payer. Please try again.');
    }
});

// Function to delete a tax payer
async function deleteTaxPayer(e) {
    const tid = trim(e.target.getAttribute('data-tid'));
    if (confirm(`Are you sure you want to delete the tax payer with TID: ${tid}?`)) {
        try {
            const result = await backend.deleteTaxPayer(tid);
            if (result) {
                alert('TaxPayer deleted successfully!');
                displayTaxPayers();
            } else {
                alert('Failed to delete TaxPayer. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting tax payer:', error);
            alert('Failed to delete tax payer. Please try again.');
        }
    }
}

// Function to edit a tax payer
async function editTaxPayer(e) {
    const tid = trim(e.target.getAttribute('data-tid'));
    try {
        const result = await backend.searchTaxPayer(tid);
        if (result && result.length > 0) {
            const taxPayer = result[0];
            document.getElementById('editTid').value = taxPayer.tid;
            document.getElementById('editFirstName').value = taxPayer.firstName;
            document.getElementById('editLastName').value = taxPayer.lastName;
            document.getElementById('editAddress').value = taxPayer.address;
            document.getElementById('editModal').style.display = 'block';
        } else {
            alert('Failed to load TaxPayer information. Please try again.');
        }
    } catch (error) {
        console.error('Error loading tax payer for edit:', error);
        alert('Failed to load tax payer information. Please try again.');
    }
}

// Function to update a tax payer
document.getElementById('editTaxPayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tid = trim(document.getElementById('editTid').value);
    const firstName = trim(document.getElementById('editFirstName').value);
    const lastName = trim(document.getElementById('editLastName').value);
    const address = trim(document.getElementById('editAddress').value);

    try {
        const result = await backend.updateTaxPayer(tid, firstName, lastName, address);
        if (result) {
            alert('TaxPayer updated successfully!');
            document.getElementById('editModal').style.display = 'none';
            displayTaxPayers();
        } else {
            alert('Failed to update TaxPayer. Please try again.');
        }
    } catch (error) {
        console.error('Error updating tax payer:', error);
        alert('Failed to update tax payer. Please try again.');
    }
});

// Function to perform database cleanup
document.getElementById('cleanupButton').addEventListener('click', async () => {
    if (confirm('Are you sure you want to perform database cleanup? This will delete all records with spaces in the TID.')) {
        try {
            const deletedCount = await backend.databaseCleanup();
            alert(`Database cleanup completed. ${deletedCount} record(s) were deleted.`);
            displayTaxPayers();
        } catch (error) {
            console.error('Error during database cleanup:', error);
            alert('Failed to perform database cleanup. Please try again.');
        }
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