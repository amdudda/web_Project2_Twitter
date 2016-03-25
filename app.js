/*
 * THIS CODE MANAGES THE HOME PAGE
 */ 

var express = require('express');
var path = require('path');
var routes = require('./routes/index');  // home page

var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku  -- see https://scotch.io/tutorials/how-to-deploy-a-node-js-app-to-heroku
var port = process.env.PORT || 3010;

/* This tells the server where to look for views and which engine to use. */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// and tell it where our static resources (eg stylesheets or images) live
app.use(express.static(path.join(__dirname, "static")));

/* And this is what we want the server to do once it fires up the listener */
app.listen(port, function() {
	console.log("TwitterBot homepage listening on port 3010");
});

app.use('/', routes);  // home page

//THIS LISTENS TO THE PORT AND SERVES THE HOMEPAGE
//I've included it here instead of as a separate file so I can pass the current image's file name to index.jade (because it could be .gif, .jpg, .png...)
var express = require("express");
var router = express.Router();
var imageFileName = "pixabay.jpg";  // the vast majority of files seem to be .jpg, so use that as a default assumption in case program needs restarted

/* GET the app's home page */
router.get('/',indexpage);

function indexpage(req, res) {
	// this code passes variables to index.jade
	//console.log(req.body);
	res.render('index',userData);
}

module.exports = router;


/*
 * THIS CODE MANAGES THE TWITTERBOT
 * also stores some values to pass to homepagea
 */ 
// skeleton cadged from https://www.npmjs.com/package/twitter
var Twitter = require('twitter');
var fs = require('fs');
var request = require('request');


var client = new Twitter({
  consumer_key: process.env.TWIT_CONSUMER_KEY,
  consumer_secret: process.env.TWIT_CONSUMER_SECRET,
  access_token_key: process.env.TWIT_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET
});
 

// some global variables
var testURL = "";
var suffix = "";
var targetLocation = "";
var creditString = "";
var userData = { 'image':imageFileName } //, 'profileUrl':'http://minneapolis.edu' };
var fiveMinutes = 5 * 60 * 1000;
var twelveHours = 12 * 60 * 60 * 1000;

setInterval(getAndPost, fiveMinutes);

function getAndPost() {
	getNewImage(

		// use function from StackOverflow and use callback to post the data when
		// I have it.
		function () {
			// need to decide where to save the image.
			// NB: not cleaning this up, so that it can be grabbed and used if I set up an info page.
			suffix = testURL.substring(testURL.lastIndexOf("."));
			imageFileName = "pixabay" + suffix;
			targetLocation = "static/" + imageFileName;

			// download image and save to target location
			download(testURL, targetLocation, function(){

				var data = require('fs').readFileSync(targetLocation);

				// Make post request on media endpoint. Pass file data as media parameter
				PostToTwitter('media/upload', {media: data})
	
			});
		}
	);
}

// FUNCTIONS

/*
 * a function to fetch and save remote image,
 *  then use callback to post to twitter
 * stole the image download code from 
 * http://stackoverflow.com/questions/12740659/downloading-images-with-node-js
 */

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    // console.log('content-type:', res.headers['content-type']);
    // console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// a function to post image to twitter
function PostToTwitter(type, contents){

	client.post(type, contents, function(error, media, response){

		  if (!error) {

			// If successful, a media object will be returned.
			//console.log(creditString);

			// Lets tweet it
			var status = {
			  status: creditString, // generated when the image was selected,
			  media_ids: media.media_id_string // Pass the media id string
			}

			client.post('statuses/update', status, function(error, tweet, response){
			  if (!error) {
				var currentTimestamp = new Date();
				console.log("Posted image at " + currentTimestamp + "!");
				//console.log(tweet);
			  }
			});

		  }
		});

}

// a function to fetch an image
// modelled this on the download function and the info at this URL:
// http://stackoverflow.com/questions/2190850/create-a-custom-callback-in-javascript

function getNewImage(callback) {
	// the function uses these variables
	var PIXABAY_KEY = process.env.PIXABAY_API_KEY
	var searchURL = "https://pixabay.com/api/";
	var searchParams = { 'key': PIXABAY_KEY, 'q':'monsters', 'image_type': 'photo' };

	request( {uri: searchURL, qs: searchParams}, function(error,clresponse,body){
		if (!error) {
			// try to get our data
			// let's make a token attempt to ensure we get clean JSON data so we don't run maliciously injected code.
			var myData = JSON.parse(body);
			
			if (parseInt(myData.totalHits) > 0) {
				var arraySize = myData.hits.length;

				// get a random integer between zero and length-1
				var indexToUse = Math.floor(Math.random() * arraySize);
				// grab the image associated with that index
				var imageJSON = myData.hits[indexToUse]
				testURL = imageJSON.previewURL;

				// also credit the user who uploaded the image
				var userName = imageJSON.user;
				var userID = imageJSON.user_id;
				var fullSizeImageUrl = imageJSON.webformatURL;
				var profileURL = "https://pixabay.com/en/users/" + userName + "-" + userID;
				creditString = "Uploaded by Pixabay user " + userName + ".  "
				creditString += "Full size image at: " + fullSizeImageUrl;
				
				//create some JSON attributes I can pass to the web page
				userData = { 'image':imageFileName, 'profileUrl':profileURL, 'fullImageUrl':fullSizeImageUrl, 'userName':userName };
				//console.log(userData);
				//write the data to a js file so it's persistent across reboots
				// used http://www.c-sharpcorner.com/UploadFile/dacca2/node-js-in-action-create-simple-text-file-in-node-js-using/ as a guide
				var dataToWrite = "var userData=" + JSON.stringify(userData);
				fs.writeFile('static/javascripts/userData.js',dataToWrite, function (err) {
							if (err) throw err;
							console.log('Saved latest userdata.'); 
					});

				// and here's where we do the callback function - we don't want to bother with callback if there are any errors.
				callback();
			}
			else {
			    console.log('No hits');
			}
		}
		else
		{
			console.log("Something broke!\n" + error);
		}

	});
}