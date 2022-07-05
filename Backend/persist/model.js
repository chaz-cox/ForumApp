const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        //match: [ 
           // /^\w+([\,-]?\w+)*@ //a regex email thing ...
           // "Please fill a vaild email address",
           // ],
                required: true,
                unique: true,
    },
    fullname: {type: String, required: true},
    password: {type: String, required: true},
});

const User = mongoose.model("User",userSchema);

module.exports = {
    User,
};
