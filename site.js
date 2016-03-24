/*
 * THIS CODE MANAGES THE HOME PAGE
 */ 
var express = require('express');
var path = require('path');
var routes = require('./routes/index');  // home page
//var about = require('./routes/about');  // about page

var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku  -- see https://scotch.io/tutorials/how-to-deploy-a-node-js-app-to-heroku
var port = process.env.PORT || 3010;

/* This tells the server where to look for views and which engine to use. */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// and tell it where our static resources (eg stylesheets or images) live
//app.use(express.static(path.join(__dirname, "static")));

/* And this is what we want the server to do once it fires up the listener */
app.listen(port, function() {
	console.log("TwitterBot app listening on port 3010");
});

app.use('/', routes);  // home page
// app.use('/about', about);  // about page

module.exports = app;

