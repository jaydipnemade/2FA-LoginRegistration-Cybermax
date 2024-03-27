import Urlvar from './urlVar.js';



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        // const token = document.getElementById("token").value;

        try {
            const response = await fetch(`http://${Urlvar}:3000/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.qrcode) {

                    alert("Login successful! Please scan the QR code with Google Authenticator.");
                    window.location.href = `./2fa.html?qrCodeUrl=${encodeURIComponent(data.qrcode)}&email=${encodeURIComponent(email)}`;
                } else {
                    alert(data.message);
                    window.location.href = "./dashboard.html"
                }

            } else {
                alert("Incorect...check password or email again");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});


