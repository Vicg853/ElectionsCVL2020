const mongoose = require("mongoose");

const schoolCardUserSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true,
    },
    password: {
        type: Array,
        required: true,
    }
});

module.exports = mongoose.model("SchoolCardUser", schoolCardUserSchema);