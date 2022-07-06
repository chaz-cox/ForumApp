const express = require('express');
const { User, Thread } = require("../persist/model");
const setUpAuth = require("./auth");
const setUpSession = require("./session");
const app = express();

app.use(express.json());

// allow serving of UI code
app.use(express.static(`${__dirname}/../public/`));

setUpSession(app);
setUpAuth(app);

app.post("/users", async (req, res) => {
    try{
        let user = await User.create({
            username: req.body.username,
            fullname: req.body.fullname,
            password: req.body.password,
        });
        res.status(201).json(user);
    }catch (err){
        res.status(500).json({
            message: `post request failed to create user`,
            error: err,
        });
    }
});

app.post("/thread", async (req, res) => {
    if (!req.user){
        res.status(401).json({ message: "unauthed"});
        return;
    }
    try {
        let thread = await Thread.create({
            user_id: req.user.id,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
        });
        req.status(201).json(thread);
    }catch (err) {
        res.status(500).json({
            message: "could not create thread",
            error: err,
        });
    }
});

app.get("/thread/:id",(req,res) => {});

app.get("/thread", async (req, res) => {
    try{
        let threads = await Thread.find({}, "-posts");
    }catch(err){
        console.log("ERROR getting threads");
    }

    for (i=0 ; i<threads.length; i++){
        try{
            threads[i] = threads[i].toObject();
            let user = await User.findById(threads[i].user_id, "-password");
            threads[i].user = user;
        }catch (err){
            res.status(500).json({
            message: "failed to find threads",
            error: err,
        });
    }
});

module.exports = app;


