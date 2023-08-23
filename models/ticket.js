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

const ticketSchema = new mongoose.Schema({
    client: {
        type: clientSchema,
        required: true
    },
    requestSubject: {
        type: String,
        required: true
    },
    requestDetails: {
        type: String,
        required: true
    },
    notes: {
        type: [{
            noteContent: String,
            time: { type: Date, default: Date.now }
        }],
        default: []
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        enum: ["New", "Acknowledged", "Waiting for Client", "Resolved"],
        default: "New"
    }
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports =  Ticket;