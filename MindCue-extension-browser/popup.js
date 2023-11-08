

// // sending message to background!
// let v = document.getElementById("sign_in_button")
// function sendMessage() {
//   // Send an object as the message, not a string
//   chrome.runtime.sendMessage(
//     { message: "hello background i'm popupppppp" },
//     (response) => {
//      alert(response)
//     }
//   );
// }


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
        localStorage.setItem("userId", data.userId);
        window.location.href = "Dashboard.html";
    })
    .catch(error => {
        console.error("An error occurred:", error);
        alert("An error occurred: " + error.message); 
    });
});





