var NodeGeocoder = require('node-geocoder')

var options = {
  provider: 'google',
  apiKey: 'GOOGLE_API_KEY'
};

var geocoder = NodeGeocoder(options);

// Special function to get city name from location

function getCityName(lat, lon) {
  return geocoder.reverse({lat: lat, lon: lon}).then(function(res) {
    return {code: 'CITY', text: res[0].city ? res[0].city : 'NA'} ;
  })
  .catch(function(err) {
    console.log(err);
  });
}

module.exports = {
  getCityName: getCityName
}
