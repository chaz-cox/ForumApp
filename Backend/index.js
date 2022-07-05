const app = require("./server/server");
const {connect , onConnect} = require("./persist/connect");
const config = require("./config");

onConnect(() => {
    app.listen(8080, () =>{
        console.log("server running on port 8080");
    });
});

try{
    connect(
        config.mongo_user,
        config.mongo_pass,
        config.mongo_port,
        config.mongo_host,
        config.mongo_db,
    );
} catch (err){
    console.log(err);
    throw "couldnt start";
}

