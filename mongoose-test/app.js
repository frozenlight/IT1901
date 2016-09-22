
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

// Use native Node promises
// Method deprecated!!
// mongoose.Promise = global.Promise;

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
	console.log('Something is happening.');
	next()
})

app.use('/', router);

////////////////////////////////////////////////////////////
// Start of main body
// Express routing functions
////////////////////////////////////////////////////////////

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// Routing functions for /stages/
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

router.route('/form')

	.post(function(req, res) {

		console.log(req.body.name);

    	var name = req.body.name,
        	price = req.body.price,
        	capacity = req.body.capacity

    	console.log(name + ' | ' + price + ' | ' + capacity);

    	Stage.create({
    		name:name,
    		capacity:capacity,
    		price:price,
    	})
    })
    .get(function(req,res){
		res.sendFile(__dirname + '/templates/form.html')
	})

router.route('/stage/:stage_id')

	.get(function(req,res){

		Stage.findById(req.params.stage_id, function(err,stage) {
			if (err) {res.send(err)}

			res.json(stage);
		})
	})

////////////////////////////////////////////////////////////
// Run Express server
////////////////////////////////////////////////////////////

// Select which port to run the server on
var port = 8000;

app.listen(port, function(){
	console.log('Express server running at port ' + port);
})

// Template for Express Route
/*
router.route('/stages')

	.post(function(res,req){

		res.render();
	})

	.get(function(req,res){

		res.render();

	});

	.delete(function(res,req){

		res.render();
	})

	.(function(res,req){

		res.render();
	})
*/