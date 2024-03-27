// registration.js
import Urlvar from './urlVar.js ';

document.getElementById("registrationForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const response = await fetch(`http://${Urlvar}:3000/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            alert("Registration successful!");
            window.location.href = "./";
        } else {
            const data = await response.json();
            alert(data.message);
        }
        // if (response.ok) {
        //     const data = await response.json();
        //     document.getElementById("qrCode").src = data.qrCodeUrl;
        // } else {
        //     
        // }
    } catch (error) {
        console.error("Error:", error);
    }
});
