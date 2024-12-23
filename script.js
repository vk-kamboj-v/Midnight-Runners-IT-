// Example JavaScript code for handling login and registration

// Mock database of users
let users = [];

document.getElementById('register-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Save user to mock "database"
    users.push({ username, password });
    alert('Registration Successful!');
    window.location.href = 'login.html';
});

document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    // Check if user exists in mock "database"
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid login credentials!');
    }
});

function logout() {
    alert('You have logged out.');
}