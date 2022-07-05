const session = require("express-session");

const setUpSessionStore = function (app){
    app.use(
        session({
            secret: "keyboardcat",
            resave: false,
            saveUnintialized: false,
        })
    );
};

module.exports = setUpSessionStore;
