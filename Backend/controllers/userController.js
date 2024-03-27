const bcrypt = require('bcryptjs');
const otplib = require('otplib');
const QRCode = require('qrcode');
const User = require('../model/userModel')

// function register
async function registerUser(req, res) {
    const { email, password } = req.body;
    try {

        const secretKey = otplib.authenticator.generateSecret();
        // const otpAuthUrl = otplib.authenticator.keyuri(email, 'MyService', secretKey);
        // const qrCodeUrl = await generateQRCode(otpAuthUrl);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, secretKey, isVarified: false });
        await newUser.save();
        // console.log(qrCodeUrl);
        return res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: "Registration failed" });
    }
}
// function genrateqrcode
async function generateQRCode(otpAuthUrl) {
    try {
        return await QRCode.toDataURL(otpAuthUrl);
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}
// function verify2fa
async function verify2FA(req, res) {
    const { token, email } = req.body;

    try {
        var user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const verified = otplib.authenticator.verify({ token, secret: user.secretKey });

        if (verified) {
            user.isVarified = true;
            await user.save();
            console.log(user.isVarified);
            return res.sendStatus(200);
        } else {
            return res.status(401).json({ message: "Invalid 2FA token" });
        }
    } catch (error) {
        console.error('Error verifying 2FA:', error);
        res.status(500).json({ message: "Error verifying 2FA" });
    }
}
// function login user
async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        else if (!user.isVarified) {
            const otpAuthUrl = otplib.authenticator.keyuri(email, 'MyService', user.secretKey);

            // Generate QR code for user
            const qrCodeUrl = await generateQRCode(otpAuthUrl);
            return res.status(200).json({ qrcode: qrCodeUrl })
        } else {
            return res.status(200).json({ message: "login successfull" })
        }

        return res.sendStatus(200); // Login successful
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: "Error logging in user" });
    }
}

module.exports = {
    registerUser,
    verify2FA,
    loginUser
};