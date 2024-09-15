document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/bookings');
        const bookings = await response.json();
        const tableBody = document.querySelector('#bookings-table tbody');

        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.date}</td>
                <td>${booking.clientName}</td>
                <td>${booking.service}</td>
                <td>${booking.status}</td>
                <td><button class="update-btn" data-id="${booking.id}">Update</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Event delegation for update buttons
        tableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('update-btn')) {
                const id = event.target.dataset.id;
                document.getElementById('booking-id').value = id;
                // Additional logic to populate the form with the selected booking's data can be added here
            }
        });

    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
});

document.getElementById('update-booking-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const id = document.getElementById('booking-id').value;

    try {
        const response = await fetch(`http://localhost:3000/api/bookings/${id}`, {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        if (result.success) {
            alert('Booking updated successfully');
            // Refresh or update the bookings table
        } else {
            alert('Failed to update booking');
        }
    } catch (error) {
        console.error('Error updating booking:', error);
    }
});
