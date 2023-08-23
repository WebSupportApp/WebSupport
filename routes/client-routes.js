const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController.js");

const Client = require("../models/client.js");
const Ticket = require("../models/ticket.js");

router.route("/")
    .get((req, res) => {
        res.render("client/clientHome", { title: "Client" });
    });

router.route("/register")

    .get((req, res) => {
        res.render("client/register", { title: "Client | Register" });
    })

    .post(clientController.register_client);

router.route("/request")
    .get((req, res) => {
        res.render("client/request", { title: "Client | Request" });
    })
    .post(clientController.new_request);

module.exports = router;