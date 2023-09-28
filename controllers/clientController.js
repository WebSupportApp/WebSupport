const Client = require("../models/client.js");
const Ticket = require("../models/ticket.js");

exports.register_client = (req, res) => {
    const newClient = new Client(req.body);
    newClient.save((err, client) => {
        if (err) {
            console.log(err);
            res.status(500).render("error/500", { url: req.url, message: "Unable to save client" });
        } else {
            req.session.user = client._id;
            res.redirect("/client/home");
        }
    });
}

exports.new_request = (req, res) => {
    Client.findById(req.session.user, (err, clientFound) => {
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
                    res.redirect("/client/home");
                }
            })
        }
    });
}

exports.authenticate_client = (req, res) => {
    Client.findOne({ email: req.body.email }, (err, clientFound) => {
        if (err) {
            res.status(404).render("error/404", { url: req.url, message: "Client Not found" });
        }
        else {
            if (!clientFound) {
                res.status(404).render("error/404", { url: req.url, message: "Client Not found" });
            } else {
                clientFound.authenticateClient(req.body.password, (err, authenticated) => {
                    if (err) {
                        res.status(500).render("error/500", { url: req.url, message: "Incorrect Password" });
                    } else {
                        if (authenticated) {
                            req.session.user = clientFound._id;
                            return res.redirect("/client/home");
                        } else {
                            res.status(500).render("error/500", { url: req.url, message: "Incorrect Password" });
                        }
                    }
                });
            }
        }
    })
};

exports.display_client_requests = (req, res) => {
    Ticket.find({ "client._id": req.session.user }, (err, foundTickets) => {
        if (err) {
            res.status(500).render("error/500", { url: req.url, message: "Unable to display tickets" });
            return res.redirect("/client/home");
        } else {
            if (!foundTickets) {
                res.status(404).render("error/404", { url: req.url, message: "No Such Ticket found" });
            } else {
                res.render("client/myRequests", { tickets: foundTickets, title: "Client | Requests" });
            }
        }
    });
}

exports.display_one_ticket = (req, res) => {
    Ticket.findById(req.params.ticketID, (err, foundTicket) => {
        if (err) {
            res.status(404).render("error/404", { url: req.url, message: "Ticket not found" })
        } else {
            if (!foundTicket) {
                res.status(404).render("error/404", { url: req.url, message: "No Such Ticket found" });
            } else {
                res.render("client/ticket", { ticket: foundTicket, title: "Client | Ticket" });

            }
        }
    });
}