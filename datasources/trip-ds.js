
var Trip = require('../models/trip')
var User = require('../models/user')

var ObjectId = require('mongoose').Types.ObjectId;

var Redis = require('./redis');

function createTrip(trip, user) {
  trip.driver = user;
  return Trip.create(trip).catch((err) => console.log(err));
}

function searchTrips(departure, arrival, date) {
  return Trip.find({
    "departure.city": new RegExp("^"+departure+"$", "i"),
    "arrival.city": new RegExp("^"+arrival+"$", "i")
  }).populate('driver')
    .then((trips) => {
      const qd = new Date(date);
      var sameDate = [];
      trips.map((t) => {
        var rd = new Date(t.date)
        if(rd.getDate() == qd.getDate() && rd.getMonth() == qd.getMonth() && rd.getYear() == qd.getYear()){
          sameDate.push(t)
        }
      })
      return sameDate
    })

}

function registeredTrips(user) {
  return Trip.find({passengers: user}).populate('driver').populate('passengers');
}

function getMyTrips(user) {
  return User.findOne({email: user.email}).then((res) => {
    return Trip.find({driver: new ObjectId(res._id)}).populate('driver').populate('passengers');
  })
}

function findTripById(id) {
  return Trip.findById(id).populate('driver').populate('passengers');
}

function register(tripId, user) {
  return Trip.findById(tripId).then((trip) => {
    if(!trip){
      return({code: "NOK", text: "Trip not found"})
    } else if(trip.passengers.length >= trip.passengersCount) {
      return({code: "NOK", text: "Trip full"})
    } else {
      var flag = false;
      for (var i = 0; i < trip.passengers.length; i++) {
        flag = user._id.toString() == trip.passengers[i].toString();
      }
      if(flag) return({code: "NOK", text: "Already registered"})
      else return Trip.updateOne(trip, { $push: { passengers: user }})
           .then((res) => ({code: "OK", text: "Passenger registered"}))
    }
  });
}

function deleteTrip(tripId, user) {
  return Trip.findById(tripId).populate('driver').then((trip) => {
    if(!trip){
      return({code: "NOK", text: "Trip not found"})
    } else if(trip.driver._id.toString() != user._id.toString()) {
      return({code: "NOK", text: "You can only modify your trips"})
    } else {
      return Trip.deleteOne(trip)
            .then((res) => {
                console.log(res);
                return({code: "OK", text: "Trip deleted"})
            }).catch((err) => {
                console.log(err);
                return({code: "SERVER ERROR", text: "Server error"})
            });
    }
  });
}

function leaveTrip(tripId, user) {
  return Trip.findById(tripId).populate('passengers').then((trip) => {
    if(!trip){
      return({code: "NOK", text: "Trip not found"})
    } else {
      const passengers = trip.passengers.map( p => p._id.toString())
      if (passengers.includes(user._id.toString())) {
        return Trip.updateOne(trip, { $pull: { passengers: user._id.toString() }})
             .then((res) => ({code: "OK", text: "Passenger removed from trip"}))
             .catch((err) => ({code: "SERVER ERROR", text: err.toString()}))
      } else {
        return ({code: "NOK", text: "Not registered in the trip"})
      }
    }
  });
}

function getPositions(tripId) {
  return Trip.findById(tripId).populate('passengers').populate('driver').then((trip) => {
    if(!trip){
      return null;
    } else {
      var promises = [];
      trip.passengers.push(trip.driver)
      trip.passengers.forEach(p => promises.push(
            Redis.get(p._id.toString())
                .then((res) => {
                  if (res) {
                    const f = res.split(",")
                    return {latitude: f[0], longitude: f[1], userId: p._id.toString()};
                  } else {
                    return null;
                  }
                })
      ));
      return Promise.all(promises).then((arr) => (arr.filter(e => e!= null)))
    }
  });
}

function setPosition(latitude, longitude, user) {
  return Redis.set(user._id.toString(), `${latitude},${longitude}`)
  .then((res) => {
      return({code: res, text: res})
  });
}

module.exports = {
  createTrip: createTrip,
  searchTrips: searchTrips,
  getMyTrips: getMyTrips,
  findTripById: findTripById,
  register: register,
  registeredTrips: registeredTrips,
  deleteTrip: deleteTrip,
  leaveTrip: leaveTrip,
  getPositions: getPositions,
  setPosition: setPosition
}
