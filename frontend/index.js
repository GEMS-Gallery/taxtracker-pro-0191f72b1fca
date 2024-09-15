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
                ${taxPayer.spyShot ? `<img src="${taxPayer.spyShot}" alt="Spy Shot" class="spy-shot">` : ''}
                <button class="update-btn" data-tid="${taxPayer.tid}">Update</button>
                <button class="delete-btn" data-tid="${taxPayer.tid}">Delete</button>
                <form class="update-form" data-tid="${taxPayer.tid}">
                    <input type="text" placeholder="First Name" value="${taxPayer.firstName}">
                    <input type="text" placeholder="Last Name" value="${taxPayer.lastName}">
                    <input type="text" placeholder="Address" value="${taxPayer.address}">
                    <input type="text" placeholder="Spy Shot URL" value="${taxPayer.spyShot || ''}">
                    <button type="submit">Save</button>
                </form>
            `;
            taxPayerList.appendChild(div);
        });

        // Add event listeners for update and delete buttons
        document.querySelectorAll('.update-btn').forEach(btn => {
            btn.addEventListener('click', toggleUpdateForm);
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTaxPayer);
        });
        document.querySelectorAll('.update-form').forEach(form => {
            form.addEventListener('submit', updateTaxPayer);
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
    const spyShot = trim(document.getElementById('spyShot').value) || null;

    try {
        await backend.addTaxPayer(tid, firstName, lastName, address, spyShot);
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
        const taxPayer = await backend.searchTaxPayer(searchTid);
        const searchResult = document.getElementById('searchResult');

        if (taxPayer.tid !== "") {
            searchResult.innerHTML = `
                <h3>Search Result:</h3>
                <p><strong>TID:</strong> ${taxPayer.tid}</p>
                <p><strong>Name:</strong> ${taxPayer.firstName} ${taxPayer.lastName}</p>
                <p><strong>Address:</strong> ${taxPayer.address}</p>
                ${taxPayer.spyShot ? `<img src="${taxPayer.spyShot}" alt="Spy Shot" class="spy-shot">` : ''}
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

// Function to toggle update form visibility
function toggleUpdateForm(e) {
    const tid = e.target.getAttribute('data-tid');
    const form = document.querySelector(`.update-form[data-tid="${tid}"]`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Function to update a tax payer
async function updateTaxPayer(e) {
    e.preventDefault();
    const tid = e.target.getAttribute('data-tid');
    const inputs = e.target.querySelectorAll('input');
    const [firstName, lastName, address, spyShot] = Array.from(inputs).map(input => trim(input.value));

    try {
        const result = await backend.updateTaxPayer(tid, firstName, lastName, address, spyShot || null);
        if (result) {
            alert('TaxPayer updated successfully!');
            displayTaxPayers();
        } else {
            alert('Failed to update TaxPayer. The TaxPayer may not exist.');
        }
    } catch (error) {
        console.error('Error updating tax payer:', error);
        alert('An error occurred while updating the tax payer. Please try again.');
    }
}

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

// Initial display of tax payers
displayTaxPayers();