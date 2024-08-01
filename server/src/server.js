const fs = require('fs');
const app = require("./app")
const https = require("https");

const {loadPlanetsData} = require("./models/planets.model");
const { mongoConnect } = require("./services/mongo");

const PORT = process.env.PORT || 8000;

/*{
  key: 'key.pem',
  cert: 'cert.pem'
}*/

const server = https.createServer({
  key: fs.readFileSync('../key.pem'),
  cert: fs.readFileSync('../cert.pem')
}, app);

async function startServer(){
  await mongoConnect();
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
  })
}

startServer();
