/**
 * Fika-sugen?
 */

require('dotenv').config();
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const moment = require('moment');

// set ejs as our template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// attach body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// register a middleware that logs all requests to the console
app.use((req, res, next) => {
	console.log(`${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} - Incoming ${req.method} request for: ${req.url}`);
	next();
});

const getDbConnection = () => {
	return require('knex')({
		client: 'mysql',
		connection: {
			host: process.env.DB_HOST || 'localhost',
			port: process.env.DB_PORT || 3306,
			user: process.env.DB_USER || 'fika',
			password: process.env.DB_PASSWORD || '',
			database: process.env.DB_NAME || 'fika',
		},
	}).debug(true);
}

// show all cafées
app.get('/cafees', (req, res) => {
	// ask database nicely for a list of all cafés
	getDbConnection().select().from('cafees')
	.then(rows => {
		// once we get the list, send it to the view
		res.render('cafees/index', {
			cafees: rows,
		});
	})
	.catch(error => {
		res.status(500).send('Sorry, database threw an error when trying to get all cafees.');
		throw error;
	});
});

// create new cafe form
app.get('/cafees/create', (req, res) => {
	res.render('cafees/create');
});

// create new cafe in db
app.post('/cafees', (req, res) => {
	console.log("Would like to create a new cafee...");

	const cafee = {
		name: req.body.name,
		address: req.body.address,
		city: req.body.city,
	}

	getDbConnection().insert(cafee).into('cafees')
	.then(results => {
		console.log("Created a new café with ID", results[0]);
		res.redirect('/cafees/' + results[0]);
	})
	.catch(error => {
		res.status(500).send('Sorry, could not create a new café.');
		throw error;
	});
});

// show specific café
app.get('/cafees/:cafeId', (req, res) => {
	const cafeId = req.params.cafeId;

	getDbConnection().select().from('cafees').where('id', cafeId)
	.then(rows => {
		const cafee = (rows.length === 1)
			? rows[0]
			: false;

		// once we get the café, send it to the view
		res.render('cafees/show', {
			cafee,
		});
	})
	.catch(error => {
		res.status(500).send(`Sorry, database threw an error when trying to get cafee with ID ${cafeId}.`);
		throw error;
	});
});

// show edit café form
app.get('/cafees/:cafeId/edit', (req, res) => {
	const cafeId = req.params.cafeId;

	getDbConnection().select().from('cafees').where('id', cafeId)
	.then(rows => {
		const cafee = (rows.length === 1)
			? rows[0]
			: false;

		// once we get the café, send it to the view
		res.render('cafees/edit', {
			cafee,
		});
	})
	.catch(error => {
		res.status(500).send(`Sorry, database threw an error when trying to get cafee with ID ${cafeId}.`);
		throw error;
	});
});

// update café with form data
app.post('/cafees/:cafeId', (req, res) => {
	const cafeId = req.params.cafeId;

	console.log(`Would like to update cafee with ID ${cafeId}...`);

	const cafee = {
		name: req.body.name || 'Default Café Name',
		address: req.body.address,
		city: req.body.city,
	}

	getDbConnection().table('cafees').update(cafee).where('id', cafeId)
	.then(results => {
		console.log(`Updated café with ID ${cafeId}`);
		res.redirect('/cafees/' + cafeId);
	})
	.catch(error => {
		res.status(500).send(`Sorry, could not update café with ID ${cafeId}.`);
		throw error;
	});
});

// serve static files from `/public` folder
// using the express static middleware
app.use(express.static('public'));

// listen on port 3000
app.listen(3000, () => {
	console.log('Server online at http://localhost:3000');
});
