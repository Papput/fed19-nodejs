/**
 * Fika-sugen?
 */

const express = require('express');
const app = express();
const moment = require('moment');

// set ejs as our template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// register a middleware that logs all requests to the console
app.use((req, res, next) => {
	console.log(`${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} - Incoming ${req.method} request for: ${req.url}`);
	next();
});

// show all cafées
app.get('/cafees', (req, res) => {
	// connect to database

	// ask database nicely for a list of all cafés

	// once we get the list, send it to the view
	res.render('cafees/index');
});

// serve static files from `/public` folder
// using the express static middleware
app.use(express.static('public'));

// listen on port 3000
app.listen(3000, () => {
	console.log('Server online at http://localhost:3000');
});
