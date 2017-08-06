const fs = require('fs');
const axios = require('axios');
const yargs = require('yargs');

// Dark Sky API key
const apiKey = 'fd131d74a83368eadd96392e315d0e89';
const saveFile = 'default-address.json';

const argv = yargs
    .options({
        a: {
            demand: false,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        },
        d: {
            demand: false,
            alias: 'default',
            describe: 'Set a default address to fetch the weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

// if user has defined a new default address, write it to file
if (argv.default) {
    fs.writeFileSync(saveFile, JSON.stringify({default: argv.default}));
}

var address = argv.address;

// if user has not defined an address, try to fetch the default from file, or cancel with error
if (!address) {
    try {
        address = JSON.parse(fs.readFileSync(saveFile)).default;
    } catch(e) {
        console.log('No custom or default address has been set. Try setting a default address or entering a custom one.');
        return;
    };
}

// THIS GETS CONVERTED BY GOOGLE TO BOUWMEESTERSSTRAT 3, 2000 ANTWERPEN, BELGIUM
//address = undefined;

var encodedAddress = encodeURIComponent(address);
var geocodeURL = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

// returns a promise, so we have a promise chain
axios.get(geocodeURL)
    .then((response) => {
        if (response.data.status === 'ZERO_RESULTS') {
            // create our own error condition that will run the catch()
            throw new Error('Unable to find that address');
        }

        var locationObj = response.data.results[0].geometry.location;
        var lat = locationObj.lat;
        var lng = locationObj.lng;
        var weatherURL = `https://api.darksky.net/forecast/${apiKey}/${lat},${lng}`;

        console.log(response.data.results[0].formatted_address);
        return axios.get(weatherURL);
    })
    .then((response) => {
        var current = response.data.currently;
        var temperature = current.temperature;
        var apparentTemperature = current.apparentTemperature;
        var precipProbability = current.precipProbability;

        console.log(`It's currently ${temperature}`);
        console.log(`It feels like ${apparentTemperature}`);
        console.log(`The chance of precipitation is ${precipProbability*100}%`);
    })
    .catch((e) => {
        if (e.code === 'ENOTFOUND') {
            console.log('ERROR: Unable to connect to API servers');
        } else {
            console.log(e.message);
        }
    });
