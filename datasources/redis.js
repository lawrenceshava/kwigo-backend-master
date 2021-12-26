const {promisify} = require('util');

const config = require('../config');

var redis = require("redis"),
    client = redis.createClient({host: config.redisHost, password: config.redisPassword});

client.on("error", function (err) {
    console.log("Error " + err);
});

client.on('connect', function() {
    console.log('REDIS CONNECTION OK');
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);

module.exports = {
        get: get,
        set: set
};
