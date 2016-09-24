
////////////////////////////////////////////////////////////
// Import statements for modules and models
////////////////////////////////////////////////////////////

// Import express, mongoose, body parser and swig
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var swig = require('swig');

// Import models for mongoose
var Stage = require('./models/Stage.js')
var Concert = require('./models/Concert.js')
var Band = require('./models/Band.js')



////////////////////////////////////////////////////////////
// Initial setup for modules
////////////////////////////////////////////////////////////

var app = express();

// Connect to MongoDB at localhost
mongoose.connect('mongodb://localhost/more-testing');

// Setup for BodyParser
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Set swig to be the standard template engine for express
// swig gets its' views from the ./views/ folder
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// Initial setup for Express Router
var router = express.Router();

router.use(function(req,res,next){
	// write request data to console for easier debugging
	var request_text = 'Request: '+req.protocol+'://'+req.hostname+'@'+req.ip+req.path;
	console.log(request_text);

	// Ensure the jump to next
	next()
})

app.use('/', router);



////////////////////////////////////////////////////////////
// Start of main body
// Express routing functions
////////////////////////////////////////////////////////////

router.get('/', function(req, res) {
	//console.log(mongoose.models)
	var pages = [
		'bands',
		'concerts',
		'stages',
	]
    res.render('frontpage', {pages:pages}); 
});



////////////////////////////////////////////////////////////
// Routing functions for /stages/
////////////////////////////////////////////////////////////

router.route('/stages')

	// POST function for /stages/
	.post(function(res,req){
		// On POST-recieve, create a Stage Object
		Stage.create()

		// Add model variables for created Stage model
		// ......

		//Send JSON message back to client
		res.json({message:'Stage created!'})
	})

	// GET Function for /stages/
	.get(function(req,res){

		// Search database for ALL stage objects
		Stage.find(function(err, stages){
			if (err){ res.send(err); }

			// Render found objects with swig and send to client 
			console.log(JSON.stringify(stages))
			res.render('stage-table', {stages:stages,title:'List of stages'});
		});
	});

router.route('/stage/:stage_id')

	.get(function(req,res){

		Stage.findById(req.params.stage_id, function(err,stage) {
			if (err) {res.send(err)}
			if (stage) {
				res.json(stage);
			}
			else {
				res.sendStatus(404);
			}
		})
	})

// Routing functions for /stages/create/
router.route('/stages/create')

	// POST function for /stages/create/
	.post(function(req,res){
		// On POST-recieve, create a Stage Object with body params from form

		var stage = new Stage({
    		name:req.body.name,
    		capacity:req.body.capacity,
    		price:req.body.price,
    	})
    	stage.save()

		// Add model other variables for created Stage model
		// ......

		// Send redirect to newly created stage object
		res.redirect('/stage/' + stage._id)
	})

	.get(function(req,res){
		res.render('stage-form',{});
	});



////////////////////////////////////////////////////////////
// Routing functions for /bands/
////////////////////////////////////////////////////////////

router.route('/bands')

	// GET Function for /bands/
	.get(function(req,res){

		// Search database for ALL stage objects
		Band.find(function(err, bands){
			if (err){ res.send(err); }

			// Render found objects with swig and send to client 
			console.log(JSON.stringify(bands))
			res.render('band-table', {bands:bands,title:'List of bands'});
		});
	});

router.route('/band/:band_id')

	.get(function(req,res){

		Band.findById(req.params.band_id, function(err,band) {
			if (err) {res.send(err)}
			if (band) {
				res.json(band);
			}
			else {
				res.sendStatus(404);
			}
		})
	})

// Routing functions for /bands/create/
router.route('/bands/create')

	// POST function for /bands/create/
	.post(function(req,res){
		// On POST-recieve, create a Band Object with body params from form

		var band = new Band({
    		name:req.body.name,
    		members:req.body.members.replaceAll(' ','').split(','),
    	})
    	band.save()

		// Add model other variables for created Band model
		// ......

		//Send JSON message back to client
		res.redirect('/band/' + band._id)
	})

	.get(function(req,res){
		res.render('band-form',{});
	});



////////////////////////////////////////////////////////////
// Routing functions for /concerts/
////////////////////////////////////////////////////////////

router.route('/concerts')

	// POST function for /concerts/
	.post(function(res,req){
		// On POST-recieve, create a Concert Object
		Concert.create()

		// Add model variables for created Concert model
		// ......

		//Send JSON message back to client
		res.json({message:'Concert created!'})
	})

	// GET Function for /concerts/
	.get(function(req,res){

		// Search database for ALL Concert objects
		Concert.find(function(err, concerts){
			if (err){ res.send(err); }

			// Render found objects with swig and send to client
			console.log(JSON.stringify(concerts))
			res.render('concert-table', {concerts:concerts,title:'List of concerts'});
		});
	});

router.route('/concert/:concert_id')

	.get(function(req,res){

		Concert.findById(req.params.concert_id, function(err,concert) {
			if (err) {res.send(err)}
			console.log(concert)
			if (concert) {
				res.json(concert);
			}
			else {
				res.sendStatus(404);
			}
		})
	})

// Routing functions for /concerts/create/
router.route('/concerts/create')

	// POST function for /concerts/create/
	.post(function(req,res){
		// On POST-recieve, create a Concert Object with body params from form
		var concert = new Concert({
			name:req.body.name,
			date:req.body.date,
			genres:req.body.genres.replaceAll(' ','').split(','),
		})
		concert.save()

		// Add model other variables for created Concert model
		// ......

		// Send redirect to concert object that was just created
		res.redirect('/concert/' + concert._id)
	})

	.get(function(req,res){
		res.render('concert-form',{});
	});



////////////////////////////////////////////////////////////
// Run Express server
////////////////////////////////////////////////////////////

// Select which port to run the server on
var port = 8000;

app.listen(port, function(){
	console.log('Express server running at port ' + port);
})



////////////////////////////////////////////////////////////
// Prototypes
////////////////////////////////////////////////////////////

// String function for replacing all instances of a substring with another string. Applies for all string objects.
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};