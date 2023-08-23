const Client = require("../models/client.js");
const Ticket = require("../models/ticket.js");

exports.register_client = (req, res) => {
    const newClient = new Client(req.body);
        newClient.save((err, client) => {
            if (err) {
                res.status(500).render("500", { url: req.url, message: "Unable to save client" });
            } else {
                res.render("client/clientID", { clientID: client._id });
            }
        });
}

exports.new_request = (req, res) => {
    Client.findOne({ email: req.body.email }, (err, clientFound) => {
        if (err) {
            res.status(404).render("error/404", { url: req.url, message: "Client Not found" });
        }
        else {
            const newTicket = new Ticket({
                client: clientFound,
                requestSubject: req.body.subject,
                requestDetails: req.body.details
            });
            newTicket.save((error, ticket) => {
                if (error) {
                    res.status(500).render("error/500", { url: req.url, message: "Could not save ticket" });
                } else {
                    res.render("client/ticketID", { ticketID: ticket._id, title: "Ticket ID" });
                }
            })
        }
    });
}