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
    let thread;
    try {
        thread = await Thread.create({
            user_id: req.user.id,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            likes: [req.user.id],
            dislikes: [],
        });
        res.status(201).json(thread);
    }catch (err) {
        res.status(500).json({
            message: "could not create thread",
            error: err,
        });
        console.log(thread);
        return;
    }
});

app.post("/thread/:id/likes", async (req, res) => {
    if (!req.user){
        res.status(401).json({ message: "unauthed"});
        return;
    }
    let id = req.params.id;
    let thread;
    try{
        thread = await Thread.findByIdAndUpdate(
            id,
            {
                $push: {
                    likes: req.user.id,
                },
            },
        );
    } catch (err){
        res.status(500).json({ message: "error trying to like"});
        return;
 }
    res.status(201).json(thread.likes);
});
        

app.post("/thread/:id/dislikes", async (req, res) => {
    if (!req.user){
        res.status(401).json({ message: "unauthed"});
        return;
    }
    let id = req.params.id;
    let thread;
    try{
        thread = await Thread.findByIdAndUpdate(
            id,
            {
                $push: {
                    dislikes: req.user.id,
                },
            },
        );
    } catch (err){
        res.status(500).json({ message: "error trying to dislike"});
        return;
 }
    res.status(201).json(thread.dislikes);
});
        
    

app.get("/thread/:id",async (req,res) => {
    let ID = req.params.id;
    let threadPosts;
    try{
        threadPosts = await Thread.findById(ID);
        if (!threadPosts){
            res.status(404).json({
                message: "thead not found",
            });
            return;
        }
    }catch(err){
        res.status(500).json({
            message: "couldnt get thread",
            error: err,
        });
        return;
    }

    try{
        threadPosts = thread.toObject();
        let user= await User.findById(threadPosts.user_id,"-password");
        thread.user = user;
    }catch(err){
        console.log("unable to get userid");
        res.status(500).json({
            message: "couldnt get thread",
            error: err,
        });
        return;
    }
    console.log(threadPosts)
    for (let i=0 ; i<threadPosts.posts.length; i++){
        try{
            let user = await User.findById(threadPosts.posts[i].user_id, "-password");
            threadPosts.posts[i].user = user;
        }catch (err){
            res.status(500).json({
            message: "failed to find thread",
            error: err,
        });
            return;
        }
    }
    res.status(200).json(threadPosts);
});

app.get("/thread", async (req, res) => {
    let threads;
    try{
        threads = await Thread.find({}, "-posts");
    }catch(err){
        res.status(500).json({ message: 'failded to get threads'});
        console.log("ERROR getting threads");
    }

    for (let i=0 ; i<threads.length; i++){
        try{
            threads[i] = threads[i].toObject();
            let user = await User.findById(threads[i].user_id, "-password");
            threads[i].user = user;
        }catch (err){
            console.log('unable to get user when getting thread');
            res.status(500).json({
            message: "failed to find threads",
            error: err,
        });
    }
    }
    res.status(200).json(threads);
});


app.post("/post", async (req, res) =>{
    if (!req.user){
        res.status(401).json({ message: "unauthed"});
        return;
    }

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

app.delete("/thread/:thead_id/post/:post_id", async (req, res) =>{
    if (!req.user){
        res.status(404).json({ message: "unauthed"});
        return;
    }

    let thread;
    let post;

    try{
        thread = await Thread.findOne({
            _id : req.params.thread_id,
        "posts_id": req.params.post_id,
        });
    } catch (err) {
        res.status(500).json({
            message: `error wrhn finding the post`,
            error: err,
        });
        return;
    }

    if(!thread){
        res.status(404).json({
            message: "thread not found when deleting post",
            thread_id: req.params.id,
            post_id: req.params.post_id,
        });
        return;
    }

    let isSameUser = false;
    for (let k in thread.posts){
        if (thread.posts[k]._id == req.params.post_id){
            post = thread.posts[k];
            if (thread.post[k].user_id == req.user.id){
                isSameUser = true;
            }
        }
    }
    if (!isSameUser){
        res.status(403).json({ message: "unautherized"});
        return;
    }

    try{
        await Thread.findByIdAndUpdate(req.params.thread_id, {
            $pull: {
                posts: {
                    _id: req.params.post_id,
                },
            },
        });
    } catch (err){
        res.status(500).json({
            message: "error deleting post",
            error: err,
        });
        return;
    }
    res.status(200).json(post);

});



app.delete("/thread/:id", async (req , res) =>{
    if(!req.user){
        res.status(404).json({ message: "unauthed"});
        return;
    }
    console.log("request to delete thread", req.params.id);

    let thread;
    try{
        thread = await Thread.findById(req.params.id);
    }catch (err){
        res.status(500).json({
            message: `failed to delete thread`,
            error: err,
        });
        return;
    }

    if( thread == null){
        res.status(404).json({
            message: `cannot find thread`, 
            thread_id: req.params.thread_id,
        });
        console.log("cannot find it");
        return;
    }

    if (thead.user_id != req.user.id){
        res.status(403).json({ message: "unarthorized"});
        return;
    }

    try{
        await Thread.findByIdAndDelete(req.params.id);
    } catch (err){
        res.status(500).json({
            message: `failed to delete post`,
            error: err,
        });
        return;
    }
    res.status(200).json(thead);
});

module.exports = app;


