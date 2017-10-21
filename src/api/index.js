import { version } from '../../package.json';
import { Router } from 'express';

const sampleDrivers = [{
	"name": "Driver A",
	"phone": "22222222"
}, {
	"name": "Driver B",
	"phone": "33333333"
}];

const findDriverByName = (name) => {
	return sampleDrivers.reduce((a,b)=>{
		if (a && a.name === name) {
			return a;
		} else if (b && b.name === name) {
			return b;
		} else {
			return null;
		}
	}, null);
}


let drivers = Router();
drivers.get('/', (req, res) => {
	res.json(sampleDrivers);
});

drivers.put('/', (req, res) => {

});

drivers.get('/:driver', (req, res) => {
	const matchedDriver = findDriverByName(req.params.driver || null);
	if (matchedDriver) {
		res.json(matchedDriver);
	} else {
		res.status(404).end();
	}
});

let sampleTrips = {};

let trips = Router();
trips.get('/', (req, res) => {
	res.json(sampleTrips);
});

trips.put('/:driver', (req, res) => {
	const { startLoc, endLoc, startTime, endTime } = req.query || {};
	const matchedDriver = findDriverByName(req.params.driver || null);
	if (matchedDriver) {
		if (startLoc && endLoc && startTime) {
			sampleTrips[matchedDriver.name] = {startLoc: startLoc, endLoc: endLoc, startTime: startTime, endTime: endTime, passengers: []};
			res.status(201).end();
			return;
		}
	}
	res.status(400).end();
});
trips.post('/add/:passenger', (req,res) => {
	const { driver } = req.query || {};
	const matchedPassenger = findPassengerByName(req.params.passenger || null);
	const matchedDriver = findDriverByName(driver || null);
	if (matchedPassenger && matchedDriver) {
		let trip = sampleTrips[matchedDriver];
		trip.passengers = trip.passengers.push(matchedPassenger);
		sampleTrips = trip;
		res.status(200).end();
		return;
	} else {
		return status(400).end();
	}
});
trips.post('/remove/:passenger', (req,res) => {
	const { driver } = req.query || {};
	const matchedPassenger = findPassengerByName(req.params.passenger || null);
	const matchedDriver = findDriverByName(driver || null);
	if (matchedPassenger && matchedDriver) {
		let trip = sampleTrips[matchedDriver];
		trip.passengers = trip.passengers.filter((passenger)=>{return passenger.name != matchedPassenger.name;});
		sampleTrips = trip;
		res.status(200).end();
		return;
	} else {
		return status(400).end();
	}
});

trips.delete('/:driver', (req, res) => {
	const matchedDriver = findDriverByName(req.params.driver || null);
	if (matchedDriver) {
		sampleTrips[matchedDriver.name] = null;
		res.status(200).end();
	}
	res.status(400).end();
});


const samplePassengers = [{
	"name": "passenger 1",
	"phone": "98765432"
}, {
	"name": "passenger 2",
	"phone": "23456789"
}];

const findPassengerByName = (name) => {
	return samplePassengers.reduce((a,b)=>{
		if (a && a.name === name) {
			return a;
		} else if (b && b.name === name) {
			return b;
		} else {
			return null;
		}
	}, null);
}

let passengers = Router();
passengers.get('/', (req, res) => {
	res.json(samplePassengers);
});

passengers.get('/:passenger', (req, res) => {
	const matchedPassenger = findPassengerByName(req.params.passenger || null);
	if (matchedPassenger) {
		res.json(matchedPassenger);
	} else {
		res.status(404).end();
	}
});

passengers.use('/call/:driver', (req, res) => {
	console.log(req.params);
	if (driver) {
		const matchedDriver = findDriverByName(req.params.driver || null);
		if (matchedDriver) {
			res.json(matchedDriver);
		}
	}
	res.status(404).end();
});

export default ({ config, db }) => {
	let api = Router();

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.use('/drivers', drivers);
	api.use('/passengers', passengers);
	api.use('/trips', trips);

	// api.get('/drivers', (req, res) => {

	// });

	return api;
}
