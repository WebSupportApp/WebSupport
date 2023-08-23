const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;