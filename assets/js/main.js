document.addEventListener('DOMContentLoaded', () => {
    // Initialize Stripe Payment Integration
    const initializeStripe = () => {
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            const stripe = Stripe('your-publishable-key-here'); // Replace with your actual publishable key
            const elements = stripe.elements();
            const card = elements.create('card');
            card.mount('#card-element');

            paymentForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const { token, error } = await stripe.createToken(card);
                if (error) {
                    console.error('Stripe error:', error);
                    alert(`Error: ${error.message}`);
                } else {
                    console.log('Token received:', token);
                    try {
                        const response = await fetch('http://localhost:3000/process_payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ token: token.id })
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        const data = await response.json();
                        if (data.success) {
                            alert('Payment successful!');
                        } else {
                            alert('Payment failed.');
                        }
                    } catch (error) {
                        console.error('Error processing payment:', error);
                        alert('An error occurred while processing payment.');
                    }
                }
            });
        }
    };

    // Initialize FullCalendar for Booking
    const initializeCalendar = () => {
        const calendarEl = document.getElementById('calendar');
        if (calendarEl) {
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                events: [
                    // Fetch or hardcode your events here
                ],
                dateClick: function (info) {
                    alert('Clicked on: ' + info.dateStr);
                    // Implement booking logic here
                }
            });
            calendar.render();
        }
    };

    // Initialize Admin Login
    const initializeAdminLogin = () => {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        if (data.role === 'admin') {
                            window.location.href = 'admin/dashboard.html';
                        } else if (data.role === 'customer') {
                            window.location.href = 'customer/dashboard.html'; // Update with your customer dashboard path
                        }
                    } else {
                        alert('Invalid username or password.');
                    }
                })
                .catch(error => {
                    console.error('Error logging in:', error);
                    alert('An error occurred while logging in.');
                });
            });
        }
    };

    // Initialize Bookings Table
    const initializeBookingsTable = () => {
        const bookingsTable = document.getElementById('bookings-table');
        if (bookingsTable) {
            fetch('http://localhost:3000/api/bookings')
                .then(response => response.json())
                .then(data => {
                    const tableBody = bookingsTable.getElementsByTagName('tbody')[0];
                    tableBody.innerHTML = ''; // Clear existing content

                    data.forEach(booking => {
                        const row = tableBody.insertRow();
                        row.insertCell(0).textContent = booking.date;
                        row.insertCell(1).textContent = booking.clientName;
                        row.insertCell(2).textContent = booking.service;
                        row.insertCell(3).textContent = booking.status;

                        const actionsCell = row.insertCell(4);

                        if (document.body.classList.contains('admin')) {
                            const acceptBtn = document.createElement('button');
                            acceptBtn.textContent = 'Accept';
                            acceptBtn.addEventListener('click', () => updateBookingStatus(booking.id, 'accepted'));
                            actionsCell.appendChild(acceptBtn);

                            const declineBtn = document.createElement('button');
                            declineBtn.textContent = 'Decline';
                            declineBtn.addEventListener('click', () => updateBookingStatus(booking.id, 'declined'));
                            actionsCell.appendChild(declineBtn);
                        }

                        const updateBtn = document.createElement('button');
                        updateBtn.textContent = 'Update';
                        updateBtn.addEventListener('click', () => populateUpdateForm(booking));
                        actionsCell.appendChild(updateBtn);

                        if (document.body.classList.contains('admin')) {
                            const cancelBtn = document.createElement('button');
                            cancelBtn.textContent = 'Cancel';
                            cancelBtn.addEventListener('click', () => cancelBooking(booking.id));
                            actionsCell.appendChild(cancelBtn);
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching bookings:', error);
                    alert('An error occurred while fetching bookings.');
                });
        }
    };

    // Handle booking status update (accept or decline)
    const updateBookingStatus = (id, status) => {
        fetch(`http://localhost:3000/api/bookings/${id}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Booking ${status}`);
                initializeBookingsTable();
            } else {
                alert('Failed to update booking status.');
            }
        })
        .catch(error => {
            console.error('Error updating booking status:', error);
        });
    };

    // Populate update form with booking details
    const populateUpdateForm = (booking) => {
        document.getElementById('booking-id').value = booking.id;
        document.getElementById('update-date').value = booking.date;
        document.getElementById('update-clientName').value = booking.clientName;
        document.getElementById('update-service').value = booking.service;
    };

    // Update booking information
    const updateBooking = (event) => {
        event.preventDefault();
        const id = document.getElementById('booking-id').value;
        const date = document.getElementById('update-date').value;
        const clientName = document.getElementById('update-clientName').value;
        const service = document.getElementById('update-service').value;

        fetch(`http://localhost:3000/api/bookings/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, clientName, service })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Booking updated successfully!');
                initializeBookingsTable();
            } else {
                alert('Failed to update booking.');
            }
        })
        .catch(error => {
            console.error('Error updating booking:', error);
        });
    };

    // Handle date cancellation
    const cancelBooking = (id) => {
        fetch(`http://localhost:3000/api/bookings/${id}/cancel`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Booking cancelled successfully!');
                initializeBookingsTable();
            } else {
                alert('Failed to cancel booking.');
            }
        })
        .catch(error => {
            console.error('Error cancelling booking:', error);
        });
    };

    // Initialize Product Page Navigation
    const initializeProductNavigation = () => {
        const productLink = document.getElementById('product-page-link');
        if (productLink) {
            productLink.addEventListener('click', () => {
                window.location.href = 'admin/product.html'; // Update with the actual path to your product page
            });
        }
    };

    // Initialize all features
    initializeStripe();
    initializeCalendar();
    initializeAdminLogin();
    initializeBookingsTable();
    initializeProductNavigation();

    // Add event listener for booking update form submission
    const updateForm = document.getElementById('update-booking-form');
    if (updateForm) {
        updateForm.addEventListener('submit', updateBooking);
    }
});
