//DEPENDENCIES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

//USE PACKAGES WITH APP
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));

//PUBLIC STATIC DIR
app.use(express.static('public'));

//DB CONFIG WITH MONGOOSE
var db = mongoose.createConnection('mongodb://heroku_363xpjk3:26h1sas658bt9ppvg6at3ou5ob@ds017736.mlab.com:17736/heroku_363xpjk3')

//SHOW MONGOOSE ERRORS
db.on('error', function(err) {
	console.log('Mongoose Error: ', err);
});

//SHOW MONGOOSE SUCCESSFUL LOGIN
db.once('open', function(){
	console.log('Mongoose connection successful.');
});

//SCRAPING
request('http://www.awwards.com/websites/clean/', function(error, response, html) {
	var $ = cheerio.load(html); //LOAD HTML INTO CHEERIO
	var result = []; //EMPTY ARRAY TO HOLD SCRAPED
	$('figure.site').each(function(i, element) { //LOOK AT ALL ARTICLES
		var article = $(element).find('a').find('img').attr('src'); //CHEERIO FINDS FIRST MATCHING CHILD
		result.push({'Link': article}); //PUSH THE ARTICLE INTO RESULT ARRAY
	});
	console.log(result); //LOGS RESULT TO CONSOLE
});

//MODELS
var Article = require('./models/Article.js');
var Comments = require('./models/Comments.js');
var User = require('./models/User.js');

//NEW USER MODEL 
var exampleUser = new User({
	name: 'Ernest Hemingway'
});

exampleUser.save(function(err, doc) {
	//LOG ERRORS
	if (err){
		console.log(err);
	//OR LOG THE DOC
	} else {
		console.log(doc);
	}
});

//ROUTES

//SIMPLE INDEX ROUTE
app.get('/', function(req, res) {
	res.send(index.html);
});

//ROUTE TO SEE COMMENTS
app.get('/notes', function(req, res) {
	Note.find({}, function(err, doc) {
		if (err) {
			res.send(err);
		} else {
			res.send(doc);
		}
	});
});

//NOTE CREATION VIA POST ROUTE
app.post('/submit', function(req, res){
	var newNote = new Note(req.body);
	newNote.save(function(err, doc){
		if (err) {
			console.log(err);
		} else {
			User.findOneAndUpdate({}, {$push: {'notes': doc.id}}, {new: true}, function(err, doc) {
				if (err) {
					res.send(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});

//USER ROUTE
app.get('/user', function(req, res) {
	User.find({}, function(err, doc) {
		if(err) {
			res.send(err);
		} else {
			res.send(doc);
		}
	});
});

//USER ARTICLES WITH NOTES
app.get('/populatedUser', function(req, res) {
	User.find({})
	.populate('notes')
	.exec(function(err, doc) {
		if (err) {
			res.send(err);
		} else {
			res.send(doc);
		}
	});
});

// Listen to Port 3005
app.listen(3005, function() {
	console.log('App running on port 3005!')
})