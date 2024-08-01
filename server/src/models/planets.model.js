const { parse } = require('csv-parse');
const fs = require("fs");
const path = require("path");
const planets = require("./planets.mongo");

function isHabitable(planet){
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36
    && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6
}

function loadPlanetsData(){
  return new Promise(((resolve, reject) => {
    fs.createReadStream(path.join(__dirname,"..","..","data","kepler_data.csv"))
      .pipe(parse({
        comment: "#",
        columns: true
      }))
      .on("data", async (data) => {
        if(isHabitable(data)){
          //habitablePlanets.push(data);
          await savePlanet(data)
        }
      }).on('error',(error) => {
      reject(error)
    }).on("end", async () => {
      const allPlanets = await getAllPlanets();
      console.log(`Habiatble planets ${allPlanets.length}`)
      resolve();
    })
  }))

}

async function getAllPlanets(){
  return planets.find({}, {
    "__v": 0,
    "_id": 0,
  });
}

async function savePlanet(planet){
  try{
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true
    });
  } catch (e) {
    console.error(`Error: ${e}`)
  }

}

module.exports = {
  getAllPlanets,
  loadPlanetsData
}