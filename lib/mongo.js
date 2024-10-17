const { MongoClient } = require('mongodb');
const config = require('config');
// Connection URL
const url = config.get('MONGO_CONNECTION_STRING_WITH_CREDS');

function connectDB() {
    try {
        const client = new MongoClient(url);
        console.log("MongoDB Connection Successful")
        return client;
    
    } catch (error) {
        console.error(error);
        return null;
    }
   
}

module.exports = connectDB;