const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController.js");

const isNotAuth = (req, res, next) => {
    if (!req.session.user) {
        res.redirect("./login");
    } else {
        next();
    }
}

const isAuth = (req, res, next) => {
    if (req.session.user) {
        res.redirect("./home");
    } else {
        next();
    }
}

router.route("/")
    .get((req, res) => {
        res.redirect("/client/login")
    });

router.route("/register")
    .get(isAuth, (req, res) => {
        res.render("client/register", { title: "Client | Register" });
    })
    .post(clientController.register_client)

router.route("/login")
    .get(isAuth, (req, res) => {
        res.render("client/clientLogin", { title: "Client | login" })
    })
    .post(clientController.authenticate_client);

router.route("/home")
    .get(isNotAuth, (req, res) => {
        res.render("client/clientHome", { title: "Client" });
    });

router.route("/request")
    .get(isNotAuth, (req, res) => {
        res.render("client/request", { title: "Client | Request" });
    })
    .post(clientController.new_request);

router.route("/chat")
    .get(isNotAuth, (req, res) => {
        res.render("client/chat", { title: "Client | Request" });
    })


router.route("/myrequests")
    .get(isNotAuth, clientController.display_client_requests)
    .post(clientController.new_request);

router.route("/ticket/:ticketID")
    .get(clientController.display_one_ticket)

router.route("/logout")
    .post((req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                res.redirect("/client/home")
            } else {
                res.redirect("/client/login");
            }
        })

    })

module.exports = router;