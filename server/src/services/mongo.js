const mongoose = require("mongoose");

const MONGO_URL = "mongodb+srv://nasa-api:PymBKFrT1YN3KAAC@cluster0.9ix0jg4.mongodb.net/nasa?retryWrites=true&w=majority";

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready')
})

mongoose.connection.on('error', (err) => {
  console.error(err)
})

console.log("SME TU");

async function mongoConnect(){
  mongoose.connect(MONGO_URL)
}

module.exports = {
  mongoConnect
};