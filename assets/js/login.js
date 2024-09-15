document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        if (result.success) {
            window.location.href = result.role === 'admin' ? 'admin/dashboard.html' : 'customer/dashboard.html';
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
});
