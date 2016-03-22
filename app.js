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
 

//can we post an image?
// Load your image

var testURL = "https://pixabay.com/static/uploads/photo/2015/10/08/14/20/street-art-977790_150.jpg";
//var lengthOfURL = testURL.length;
var suffix = testURL.substring(testURL.lastIndexOf("."));
var targetLocation = "pixabay" + suffix;
//var searchURL = "https://pixabay.com/api/?key=" + APIKEY;
//	searchURL += "&q=monsters&image_type=photo";
var creditstring = "";

getNewImage(

	// use function from StackOverflow and use callback to post the data when
	// I have it.
	function () {
		download(testURL, targetLocation, function(){
		  //console.log('done');
	
			suffix = testURL.substring(testURL.lastIndexOf("."));
			targetLocation = "pixabay" + suffix;

			var data = require('fs').readFileSync(targetLocation);

			// Make post request on media endpoint. Pass file data as media parameter
			PostToTwitter('media/upload', {media: data})
	
		});
	}
);

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
			console.log(creditstring);

			// Lets tweet it
			var status = {
			  status: creditstring + " (test)", //'Here\'s a random pixabay image!',
			  media_ids: media.media_id_string // Pass the media id string
			}

			client.post('statuses/update', status, function(error, tweet, response){
			  if (!error) {
				console.log("success!");
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
			// let's make sure we get clean JSON data so we don't run maliciously injected code.
			//var myData = JSON.stringify(body);
			// console.log(myData);
			var myData = JSON.parse(body);
			//console.log(myData.totalHits + " hits");
			
			if (parseInt(myData.totalHits) > 0) {
				var arraySize = myData.hits.length;

				// get a random integer between zero and length-1
				var indexToUse = Math.floor(Math.random() * arraySize);
				// grab the image associated with that index
				var imageJSON = myData.hits[indexToUse]
				var imageURL = imageJSON.previewURL;
	
				// change testURL to the new image
				testURL = imageURL;
				//console.log("first:" + testURL);
				// also credit the user who uploaded the image
				var userName = imageJSON.user;
				var userID = imageJSON.user_id;
				var profileURL = "https://pixabay.com/en/users/" + userName + "-" + userID;
				creditString = "Uploaded by Pixabay user " + userName + "."
/*				creditString += "<a href='" + profileURL + "'>" + userName + "</a>.";
				$("#userCredit").html(creditString);
*/		
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