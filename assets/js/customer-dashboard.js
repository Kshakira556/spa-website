document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/bookings', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } // If using token-based auth
        });
        const bookings = await response.json();
        const tableBody = document.querySelector('#past-bookings-table tbody');

        bookings.forEach(booking => {
            const row = document.create
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${booking.date}</td>
                            <td>${booking.service}</td>
                            <td>${booking.status}</td>
                        `;
                        tableBody.appendChild(row);
                    });

                } catch (error) {
                    console.error('Error fetching past bookings:', error);
                }
            });

            // Add functionality for rebooking service and requesting a review
            document.getElementById('rebook-service').addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(event.target);

                try {
                    const response = await fetch('http://localhost:3000/api/rebook', {
                        method: 'POST',
                        body: JSON.stringify(Object.fromEntries(formData)),
                        headers: { 'Content-Type': 'application/json' }
                    });

                    const result = await response.json();
                    if (result.success) {
                        alert('Service rebooked successfully');
                        // Optionally refresh bookings or handle UI changes
                    } else {
                        alert('Failed to rebook service');
                    }
                } catch (error) {
                    console.error('Error rebooking service:', error);
                }
            });

            document.getElementById('review-request').addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(event.target);

                try {
                    const response = await fetch('http://localhost:3000/api/request_review', {
                        method: 'POST',
                        body: JSON.stringify(Object.fromEntries(formData)),
                        headers: { 'Content-Type': 'application/json' }
                    });

                    const result = await response.json();
                    if (result.success) {
                        alert('Review request submitted successfully');
                        // Optionally handle UI changes
                    } else {
                        alert('Failed to submit review request');
                    }
                } catch (error) {
                    console.error('Error requesting review:', error);
                }
            });

