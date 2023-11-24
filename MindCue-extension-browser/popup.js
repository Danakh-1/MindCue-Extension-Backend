
//// Now Ill try not to loging out each time 
document.addEventListener("load", function() {
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

    console.log("Submitting login request...");

    fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        if (response.ok) {
            console.log("Login successful");
            return response.json(); 
        } else {
            console.log("Login failed");
            throw new Error("Login failed. Please check your credentials.");
        }
    })
    .then(data => {
   // Fetch the current active tab first
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // Now send the message to the content script of the active tab
    chrome.tabs.sendMessage(tabs[0].id, {
        from: "popup",
        query: "userid",
        userId: data.userId
    });
});
        localStorage.setItem("userId", data.userId);
        window.location.href = "Dashboard.html";
    })
    .catch(error => {
        console.error("An error occurred:", error);
        alert("An error occurred: " + error.message); 
    });
});


