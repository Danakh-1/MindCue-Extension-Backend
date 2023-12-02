document.getElementById('logout').addEventListener('click', function() {
    // Clear token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // Redirect to login page or change UI
    window.location.href = 'popup.html'; // Redirect to login page
    // or handle the logged-out UI state
});