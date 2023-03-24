const { MongoClient } = require('mongodb')//mongoclient allows us connect to db

let dbConnection
let uri = 'mongodb+srv://Kellym:$Kelly2021$@cluster0.nsipfj9.mongodb.net/?retryWrites=true&w=majority'

//if the database file is local, as was the case, let uri = mongodb://localhost:27017/Books 

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)//connect string to local mongodb db or to online mongodb
        .then((client) => {
           dbConnection = client.db()
           return cb()
        })
        .catch(err => {
          console.log(err) 
          return cb(err) 
        })
    }, //initially connect to db
    getDb: () => dbConnection //return db after we've connected to it
}
