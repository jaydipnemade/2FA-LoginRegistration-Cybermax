import Urlvar from './urlVar.js';

const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
console.log(email)
document.getElementById("2faForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = document.getElementById("token").value;

    try {
        const response = await fetch(`http://${Urlvar}:3000/api/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, email })
        });

        if (response.ok) {
            alert("Two-Factor Authentication successful!");
            window.location.href = "./dashboard.html"; 
        } else {
            alert("Two-Factor Authentication failed. Please check your token.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
