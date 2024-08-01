const launchesDatabase = require("./launches.mongo");
const planets = require('./planets.mongo');
const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: DEFAULT_FLIGHT_NUMBER,
  mission: "keppler explore",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 30"),
  target: "Kepler-442 b",
  customer: ['ZMT', "NASA"],
  upcoming: true,
  success: true
}

//launches.set(launch.flightNumber, launch);
saveLaunch(launch);

async function getLatestFlightHumber(){
  const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');

  if(!latestLaunch){
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function getAllLaunches(){
  //return Array.from(launches.values())
  return await launchesDatabase.find({}, {
    "_id": 0,
    "__v": 0
  })
}

async function saveLaunch(launch){
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if(!planet){
    throw new Error("No matching planet was found")
  }

  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true
  })
}

async function existsLaunchWithId(launchId){
  return await launchesDatabase.findOne({
    flightNumber: launchId
  });
}

async function scheduleNewLaunch(launch){
  const newFlightNumber = await getLatestFlightHumber() + 1

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['zero-to-mastery', 'NASA'],
    flightNumber: newFlightNumber
  })

  await saveLaunch(newLaunch)
}


async function abortLaunchById(launchId){

  const aborted =  await launchesDatabase.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false
  })

  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch
}