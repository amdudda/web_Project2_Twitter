var express = require("express");
var router = express.Router();
// var request_mod = require("request");

/* GET the app's home page */
router.get('/',indexpage);

function indexpage(req, res) {
	// this code passes variables to index.jade
	//console.log(req.body);
	res.render('index',{'image':'pixabay.jpg'});
}

module.exports = router;