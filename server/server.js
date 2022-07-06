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

app.get("/thread/:id",async (req,res) => {
    let ID = req.params.id;
    let threadPosts
    try{
        threadPosts = await thread.findById(ID);
        if (!threadPosts){
            res.status(401).json({
                message: "thead not found",
            });
            return;
        }
    }catch(err){
        res.status(500).json({
            message: "couldnt get thread",
            error: err,
        });
    }

    try{
        threadPosts = thread.toObject();
        threadPosts.user = await User.findById(threadPosts.user_id,"-password");
    }catch(err){
        res.status(500).json({
            message: "couldnt get thread",
            error: err,
        });
    }
    for (i=0 ; i<threadPosts.posts.length; i++){
        try{
            threadPosts.posts[i] = threadPosts.posts[i].toObject();
            let user = await User.findById(threadPosts.posts[i].user_id, "-password");
            threadPosts.posts[i].user = user;
        }catch (err){
            res.status(500).json({
            message: "failed to find thread",
            error: err,
        });
        }
    }
    res.status(200).json(threadPosts);
});

app.get("/thread", async (req, res) => {
    let threads;
    try{
        threads = await Thread.find({}, "-posts");
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
    }
    res.status(200).json(threads);
});

app.post("/post", async (req, res) =>{
    let thread;
    try{
        thread = await Thread.findByIdAndUpdate(
            req.body.thead._id,
            {
                $push: {
                    posts:{
                        user_id: req.user.id,
                        body: req.body.body,
                        thread_id: req.body.thread_id,
                    },
                },
            },
        {
            new: true,
        }
        );
        if (!thread) {
            res.status(404).json({
                message: `thread not found`,
                id:req.body.thread_id,
            });
            return;
        }
    }catch(err){
            res.status(500).json({
                message: `failed to insert post`,
                error: err,
            });
            return;
        }
        res.status(201).json(thread.posts[thread.post.length -1 ]);
});

module.exports = app;


