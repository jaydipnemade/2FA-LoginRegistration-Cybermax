const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    secretKey: String,
    isVarified : Boolean

});

module.exports = mongoose.model('User', userSchema);
