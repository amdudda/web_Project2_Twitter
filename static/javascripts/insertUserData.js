// parses userData.js and inserts into relevant places on homepage
// get the JSON data from userData.js, which will have already been loaded by index.jade
var savedData = userData;
//console.log(userData);
var fullSize = savedData.fullImageUrl;
var smallSize = savedData.image;
var profUrl = savedData.profileUrl;
var user = savedData.userName;

var curTag = document.getElementById('fullPicUrl');
curTag.setAttribute('href', fullSize);

curTag = document.getElementById('smallImage');
curTag.setAttribute('src', smallSize);

curTag = document.getElementById('credit');
curTag.setAttribute('href', profUrl);
curTag.innerText = user;
