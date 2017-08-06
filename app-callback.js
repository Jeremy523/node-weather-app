const yargs = require('yargs');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const argv = yargs
	.options({
		a: {
			demand: true,
			alias: 'address',
			describe: 'Address to fetch weather for',
			string: true
		}
	})
	.help()
	.alias('help', 'h')
	.argv;

geocode.geocodeAddress(argv.address, (errorMsg, results) => {
	if (errorMsg) {
		console.log(errorMsg);
	} else {
		console.log(`Address: ${results.address}`);
		weather.getWeather(results.latitude, results.longitude, (errorMsg, weatherResults) => {
			if (errorMsg) {
				console.log(errorMsg);
			} else {
				console.log(`It's currently ${weatherResults.temperature}`);
				console.log(`It feels like ${weatherResults.apparentTemperature}`);
				console.log(`Precipitation Chance: ${weatherResults.precipProbability}`);
			}
		});
	}
});
