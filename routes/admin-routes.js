const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");

const Client = require("../models/client.js");
const Ticket = require("../models/ticket.js");

router.route("/")
    .get((req, res) => {
        res.render("admin/adminHome", { title: "Admin" });
    });

router.route("/openTickets")
    .get(adminController.show_open_tickets);

router.route("/ticket/:ticketID")

    .get(adminController.display_ticket)

    .post(adminController.update_ticket);

router.route("/searchTicket")
    .get((req, res) => {
        res.render("admin/searchTicket", { title: "Admin | Search Ticket" });
    })
    .post((req, res) => {
        res.redirect("/admin/ticket/" + req.body.ticketID);
    });

module.exports = router;