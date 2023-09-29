const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config({ path: "../config/.env" });

const clientSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

clientSchema.pre("save", function (next) {
    var client = this;

    // only hash the password if it has been modified (or is new)
    if (!client.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(Number(String(process.env.SALT_WORK_FACTOR)), function (err, salt) {
        if (err) {
            return next(err);
        }
        // hash the password using our new salt
        bcrypt.hash(client.password, salt, function (error, hashedPassword) {
            if (error) {
                return next(error);
            }
            // override the cleartext password with the hashed one
            client.password = hashedPassword;
            next();
        });
    });


});

clientSchema.methods.authenticateClient = function (enteredPassword, cb) {
    bcrypt.compare(enteredPassword, this.password, function (err, authenticated) {
        if (err) {
            return cb(err);
        }
        cb(null, authenticated);
    });
}

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;