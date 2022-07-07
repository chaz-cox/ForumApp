const session = require("express-session");
const config = require("../config");

const setUpSessionStore = function (app){
    app.use(
        session({
            secret: config.session_key,
            resave: false,
            saveUninitialized: false,
        })
    );
};

module.exports = setUpSessionStore;
