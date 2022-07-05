const mongoose = require('mongoose');
const db = mongoose.connection;

async function connect(user , pass, host, port, db_name){
    let connectString = `mongodb://${user}:${pass}@${host}:${port}/${db_name}`;
    try{
       await mongoose.connect(connectString, {
           useNewUrlParser: true,
           useUnifiedTopology: true,
       });
    }catch (err){
        console.log("error connection to mongoose", err);
        throw "mongo couldnt connect";
    }
}

function onConnect(callback){
    db.once("open", () => {
        console.log("mongo connection open");
        callback();
    });
}

module.exports = {
    connect, 
    onConnect,
};

