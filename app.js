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
var suffix = "." + testURL.substring(testURL.lastIndexOf("."));
var targetLocation = "pixabay" + suffix;

// use function from StackOverflow and use callback to post the data when
// I have it.
download(testURL, targetLocation, function(){
  //console.log('done');
	
	var data = require('fs').readFileSync(targetLocation);

	// Make post request on media endpoint. Pass file data as media parameter
	PostToTwitter('media/upload', {media: data})
	
});


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
			//console.log(media);

			// Lets tweet it
			var status = {
			  status: 'Another test post of pixabay image',
			  media_ids: media.media_id_string // Pass the media id string
			}

			client.post('statuses/update', status, function(error, tweet, response){
			  if (!error) {
				console.log(tweet);
			  }
			});

		  }
		});

}