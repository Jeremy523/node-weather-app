const request = require('request');
const apiKey = 'fd131d74a83368eadd96392e315d0e89';
// darksky API key: fd131d74a83368eadd96392e315d0e89

var getWeather = (latitude, longitude, callback) => {
	request({
		url:`https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude}`,
		json: true
	}, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			var current = body.currently;
			callback(undefined, {
				temperature: current.temperature,
				apparentTemperature: current.apparentTemperature,
				precipProbability: `${current.precipProbability*100}%`
			});
		} else {
			callback('Unable to fetch weather');
		}
	});
};

module.exports = {
	getWeather
};
