// Function to toggle between the login and sign-up forms
function toggleForm() {
    var loginForm = document.getElementById('login-form');
    var signupForm = document.getElementById('signup-form');
    
    // Toggle the visibility of the login and sign-up forms
    loginForm.classList.toggle('active');
    signupForm.classList.toggle('active');
}

// Set default form to be the login form
window.onload = function() {
    document.getElementById('login-form').classList.add('active');
};