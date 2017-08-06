const request = require('request');

var geocodeAddress = (address, callback) => {
	var encodedAddress = encodeURIComponent(address);

	// make a http request to retrieve json data
	request({
		url: `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
		json: true
	}, (error, response, body) => {
		// callback when request is complete
		//console.log(JSON.stringify(body, undefined, 2));
		if (error) {
			callback('Unable to connect to Google API');
		} else if (body.status === 'ZERO_RESULTS') {
			callback('Unable to find specified address')
		} else if (body.status === 'OK') {
			var bodyRes = body.results[0];
			callback(undefined, {
				address: bodyRes.formatted_address,
				latitude: bodyRes.geometry.location.lat,
				longitude: bodyRes.geometry.location.lng
			});
		}
	});
};

module.exports = {
	geocodeAddress
};
