const Client = require("../models/client.js");
const Ticket = require("../models/ticket.js");

exports.show_open_tickets = (req, res) => {
    Ticket.find({ status: { $ne: "Resolved" } }, (err, foundOpenTickets) => {
        if (err) {
            res.status(500).render("error/500", { url: req.url, message: "Unable to display open tickets" });
        } else {
            res.render("admin/listOfTickets", { tickets: foundOpenTickets, title: "Admin | Open Tickets" });
        }
    });
}

exports.display_ticket = (req, res) => {
    Ticket.findById(req.params.ticketID, (err, foundTicket) => {
        if (err) {
            res.status(404).render("error/404", { url: req.url, message: "Ticket not found" })
        } else {
            res.render("admin/ticket", { ticket: foundTicket, title: "Admin | Ticket" });
        }
    });
} 

exports.update_ticket = (req, res) => {
    Ticket.findOneAndUpdate({ _id: req.params.ticketID },
        { $push: { notes: { noteContent: req.body.newNoteContent } }, status: req.body.status }, (err) => {
            if (err) {
                res.status(404).render("error/404", { url: req.url, message: "Ticket not found" });
            } else {
                res.redirect("/admin/ticket/" + req.params.ticketID);
            }
        }
    );
}