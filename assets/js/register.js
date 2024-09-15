document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        if (result.success) {
            alert('Registration successful');
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            alert('Failed to register');
        }
    } catch (error) {
        console.error('Error registering user:', error);
    }
});
