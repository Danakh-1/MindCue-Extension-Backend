
//// Now Ill try not to loging out each time 
window.addEventListener("load", function() {
    const userId = localStorage.getItem("userId");
    if (userId) {
        window.location.href = "Dashboard.html";
    }
});

///////////////////////////////////////////code BOODAI
document.getElementById("sign_in_form").addEventListener("submit", function (e) {
    e.preventDefault();
    // Get user input
    const email = document.getElementById("sign_in_email").value;
    const password = document.getElementById("sign_in_password").value;

    fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            throw new Error("Login failed. Please check your credentials.");
        }
    })
    .then(data => {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("token", data.token); // Store the token
    
        chrome.storage.local.set({ userId: data.userId }, function() {
            console.log('UserId is saved in Chrome local storage.');
        });
        chrome.storage.local.set({ token: data.token }, function() {
            console.log('token is saved in Chrome local storage.');
        });
        window.location.href = "Dashboard.html";
    })
    .catch(error => {
        alert("An error occurred: " + error.message); 
    });
});

function isTokenExpired(token) {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const decoded = JSON.parse(decodedJson);
    const exp = decoded.exp;
    const currentUnixTime = Math.floor(Date.now() / 1000);
    return exp < currentUnixTime;
}

document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
        window.location.href = "Dashboard.html"; // Redirect to Dashboard if logged in and token is valid
    } else {
        window.location.href = "popup.html"; 
        localStorage.removeItem("token"); // Remove expired token
        // Show login form or handle not logged-in state
    }
});
