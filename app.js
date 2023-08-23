const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require('dotenv');
const clientRoutes = require("./routes/client-routes.js");
const adminRoutes = require("./routes/admin-routes.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use( express.static("/public"));
 
app.set("view engine", "pug");

dotenv.config({path: "./config/.env"});

let url = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });

app.use("/client", clientRoutes);

app.use("/admin", adminRoutes)

app.get("/public/:filename", (req, res) => {
    let file_url = decodeURI(req.url);
    let filePath = path.resolve("./" + file_url);
    res.download(filePath);
}
);

app.get('*', function (req, res) {
    res.status(404).render("error/404", { url: req.url, message: "Page not found" });
});

app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
});