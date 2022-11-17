const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "pug");

let url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/webSupportDB?retryWrites=true&w=majority`;

console.log(url);

mongoose.connect(url, { useNewUrlParser: true });

const { Client, Ticket } = require("./models.js")

app.get("/public/:filename", (req, res) => {
    let file_url = decodeURI(req.url);
    let filePath = path.resolve("./" + file_url);
    res.download(filePath);
}
);

app.route("/client")
    .get((req, res) => {
        res.render("clientHome", { title: "Client" });
    });

app.route("/client/register")

    .get((req, res) => {
        res.render("register", { title: "Client | Register" });
    })

    .post((req, res) => {
        const newClient = new Client(req.body);
        newClient.save((err, client) => {
            if (err) {
                res.status(500).render("500", { url: req.url, message: "Unable to save client" });
            } else {
                res.render("clientID", { clientID: client._id });
            }
        })
    });

app.route("/client/request")
    .get((req, res) => {
        res.render("request", { title: "Client | Request" });
    })
    .post((req, res) => {
        Client.findOne({ email: req.body.email }, (err, clientFound) => {
            if (err) {
                res.status(404).render("404", { url: req.url, message: "Client Not found" });
            }
            else {
                const newTicket = new Ticket({
                    client: clientFound,
                    requestSubject: req.body.subject,
                    requestDetails: req.body.details
                });
                newTicket.save((error, ticket) => {
                    if (error) {
                        res.status(500).render("500", { url: req.url, message: "Could not save ticket" });
                    } else {
                        res.render("ticketID", { ticketID: ticket._id, title: "Ticket ID" });
                    }
                })
            }
        });
    });

app.route("/admin")
    .get((req, res) => {
        res.render("adminHome", { title: "Admin" });
    });

app.route("/admin/openTickets")
    .get((req, res) => {
        Ticket.find({ status: { $ne: "Resolved" } }, (err, foundOpenTickets) => {
            if (err) {
                res.status(500).render("500", { url: req.url, message: "Unable to display open tickets" });
            } else {
                res.render("listOfTickets", { tickets: foundOpenTickets, title: "Admin | Open Tickets" });
            }

        });
    })

app.route("/admin/ticket/:ticketID")

    .get((req, res) => {
        Ticket.findById(req.params.ticketID, (err, foundTicket) => {
            if (err) {
                res.status(404).render("404", { url: req.url, message: "Ticket not found" })
            } else {
                res.render("ticket", { ticket: foundTicket, title: "Admin | Ticket" });
            }
        })
    })
    .post((req, res) => {
        Ticket.findOneAndUpdate({ _id: req.params.ticketID },
            { $push: { notes: { noteContent: req.body.newNoteContent } }, status: req.body.status }, (err) => {
                if (err) {
                    res.status(404).render("404", { url: req.url, message: "Ticket not found" });
                } else {
                    res.redirect("/admin/ticket/" + req.params.ticketID);
                }
            }
        );
    });

app.route("/admin/searchTicket")
    .get((req, res) => {
        res.render("searchTicket", { title: "Admin | Search Ticket" });
    })
    .post((req, res) => {
        res.redirect("/admin/ticket/" + req.body.ticketID);
    });

app.get('*', function (req, res) {
    res.status(404).render("404", { url: req.url, message: "Page not found" });
});

app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
});