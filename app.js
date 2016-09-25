
////////////////////////////////////////////////////////////
// Import statements for modules and models
////////////////////////////////////////////////////////////

// Import express, mongoose, body parser and swig
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var swig = require('swig');
var https = require('https');
var request = require('request');
//var admin = require('node-django-admin');
//var mongooseadmin = require('mongooseadmin');
//var formage = require('formage');
/*var admin = require('formage-admin').init(app, express,require('./models'),{
    title: title || 'Formage Example',
    default_section: 'Main',
    admin_users_gui: true
});*/
//var mongo_express = require('mongo-express/lib/middleware')
//var mongo_express_config = require('./mongo_express_config')
//require('coffee-script/register')
//penguin = require('penguin')

// Import models for mongoose
var Stage = require('./models/Stage.js');
var Concert = require('./models/Concert.js');
var Band = require('./models/Band.js');



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
//app.use(app.router);
app.use('/', router);

//admin.config(app, mongoose, '/admin');
//app.use('/admin',mongooseadmin({title:"Adminpanel"}));
/*formage.init(app, express, mongoose.models, {
    title: 'Admin',
    root: '/admin',
    default_section: 'main',
    username: 'admin',
    password: 'admin',
    admin_users_gui: true
});*/
//app.use('/mongo_express', mongo_express(mongo_express_config))

//for penguin
//admin = new penguin.Admin()
//admin.setupApp(app)


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
		// On POST-recieve,
		

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

				res.render('band-page',band);
			}
			else {
				res.sendStatus(404);
			}
		})
	})

router.route('/band/:band_id/edit')

	.post(function(req,res) {

		Band.findById(req.params.band_id, function(err,band) {
			if (err) {res.send(err)}
			if (band) {
				Object.keys(req.body).forEach(function(key,index) {
					if (req.body[key] != ''){
						band[key] = req.body[key]
					}
				});


				res.redirect('/band/' + band._id)
			}
			else {
				res.sendStatus(404);
			}
		})
	})

	.get(function(req,res){

		Band.findById(req.params.band_id, function(err,band) {
			if (err) {res.send(err)}
			if (band) {

				res.render('band-edit',band);
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

    	//var spotify_data = spotify_get_artist(spotify_get_artist_id(band.name));
    	//console.log(spotify_get_artist_id(band.name))

    	//band.spotify_followers = spotify_data.followers.total.toString();
    	//band.spotify_genres = spotify_data.genres;
    	//band.spotify_popularity = spotify_data.popularity.toString();
    	//band.spotify_images = spotify_data.images;
    	//band.spotify_id = spotify_data.id;
    	//band.spotify_name = spotify_data.name;
    	
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
			time:req.body.time,
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



////////////////////////////////////////////////////////////
// API request
////////////////////////////////////////////////////////////

// Spotify API artist search

function spotify_get_artist_id(name){

	var path = ['https://api.spotify.com/v1/search?q=','&type=artist&limit=1'];
	var r
	var options = {
		host: 'api.spotify.com',
		path: path.join(name.replaceAll(' ','+')),
		port: 443,
		json: true,
	}

	return request(path.join(name.replaceAll(' ','+')), function (error, response, body) {
    	//Check for error
    	if(error){
        	return console.log('Error:', error);
    	}

    	//Check for right status code
    	if(response.statusCode !== 200){
        	return console.log('Invalid Status Code Returned:', response.statusCode);
    	}

    	//All is good. Print the body
    	console.log(JSON.parse(body)); // Show the HTML for the Modulus homepage.
    	return JSON.parse(body).artist.items[0].id
	});

	/*var req = https.request(options, function(res) {
  		console.log('request status: '+res.statusCode);
  		res.on('data', function(d) {
    		r = JSON.parse(d)
    		//console.log('Getting ID: '+JSON.stringify(r))
  		});
	});
	req.end();

	req.on('error', function(e) {
  		console.error(e);
	});
	return r.artists.items[0].id*/
}

function spotify_get_artist(id){
	var path = 'https://api.spotify.com/v1/artists/'
	var r
	var options = {
		host: 'api.spotify.com',
		path: path + id,
		port: 443,
		json: true,
	}
	return request(path + id, function (error, response, body) {
    	//Check for error
    	if(error){
        	return console.log('Error:', error);
    	}

    	//Check for right status code
    	if(response.statusCode !== 200){
        	return console.log('Invalid Status Code Returned:', response.statusCode);
    	}

    	//All is good. Print the body
    	console.log(JSON.parse(body)); // Show the HTML for the Modulus homepage.
    	return JSON.parse(body)
	});

	/*var req = https.request(options, function(res) {
  		console.log('request status data: '+res.statusCode);
  		return res.on('data', function(d) {
  			r = JSON.parse(d)
  			//console.log('Getting Artist: '+JSON.stringify(r))
  			return r
  		});
	});
	req.end();

	req.on('error', function(e) {
  		console.error(e);
	});
	return r*/
}