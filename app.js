
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
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var db = require('./config/database.js');

// Import models for mongoose
var Stage = require('./models/Stage.js');
var Concert = require('./models/Concert.js');
var Band = require('./models/Band.js');
var Booking = require('./models/Booking.js');



////////////////////////////////////////////////////////////
// Initial setup for modules
////////////////////////////////////////////////////////////

var app = express();

// Connect to MongoDB at localhost
//mongoose.connect('mongodb://localhost/dicksuckingshit');
mongoose.connect(db.url);

require('./config/passport.js')(passport);

app.use(morgan('dev'));
app.use(cookieParser());

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

// setup for passport.js
app.use(session({secret: 'rainbowsandshit'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login in sessions
app.use(flash()); // use connect-flash for flash messages

app.use('/', router);

//Setup for using public directory with stylesheet, images, etc.
app.use(express.static(path.join(__dirname, 'public')));


////////////////////////////////////////////////////////////
// Start of main body
// Express routing functions
////////////////////////////////////////////////////////////

router.get('/', isLoggedIn, function(req, res) {
	Concert.find(function(err, concerts){
		if (err){ res.send(err); }

		res.render('front', {concerts:JSON.stringify(concerts)});
	});
});

////////////////////////////////////////////////////////////
// Login
////////////////////////////////////////////////////////////
// show the login form
app.get('/login', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('login.ejs', { message: req.flash('loginMessage') }); 
});

// process the login form
app.post('/login', passport.authenticate('local-login', {
	successRedirect : '/',
	failureRedirect : '/login',
	failureFlash : true
}));
	
////////////////////////////////////////////////////////////
// Signup
////////////////////////////////////////////////////////////
// show the signup form
app.get('/signup', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('signup.ejs', { message: req.flash('signupMessage') });
});

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
	successRedirect : '/profile',
	failureRedicret : '/signup',
	failureFlash : true
}));

////////////////////////////////////////////////////////////
// Logout
////////////////////////////////////////////////////////////
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

	
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}

////////////////////////////////////////////////////////////
// Routing functions for /api/
// The API is used to give frontend access to database information
// with read-only access to the models and other information we choose
////////////////////////////////////////////////////////////

router.route('/api/')
	.get(function(req,res){
		res.send("This is our API page, it should be free to use to get information")
	})

router.route('/api/concerts')
	.get(function(req,res){
		Concert.find(function(err,concerts){
			if (err) { res.send(err) }
			res.json(concerts)
		})
	})

////////////////////////////////////////////////////////////
// Routing functions for /stages/
////////////////////////////////////////////////////////////

router.route('/stages')

	// POST function for /stages/
	.post(isLoggedIn, function(res,req){
		// On POST-recieve,
		

		// Add model variables for created Stage model
		// ......

		//Send JSON message back to client
		res.json({message:'Stage created!'})
	})

	// GET Function for /stages/
	.get(isLoggedIn, function(req,res){

		// Search database for ALL stage objects
		Stage.find(function(err, stages){
			if (err){ res.send(err); }

			// Render found objects with swig and send to client 
			console.log(JSON.stringify(stages))
			res.render('stage-table', {stages:stages,title:'List of stages'});
		});
	});

router.route('/stage/:stage_id')

	.get(isLoggedIn, function(req,res){

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
	.post(isLoggedIn, function(req,res){
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

	.get(isLoggedIn, function(req,res){
		res.render('stage-form',{});
	});



////////////////////////////////////////////////////////////
// Routing functions for /bands/
////////////////////////////////////////////////////////////

router.route('/bands')

	// GET Function for /bands/
	.get(isLoggedIn, function(req,res){

		// Search database for ALL stage objects
		Band.find(function(err, bands){
			if (err){ res.send(err); }

			// Render found objects with swig and send to client 
			console.log(JSON.stringify(bands))
			res.render('bandliste', {bands:bands,title:'List of bands'});
		});
	});

// Routing function for an individual band object
router.route('/band/:band_id')

	.get(isLoggedIn, function(req,res){

		// Find object by its' id and render page to user, if not found send 404
		Band.findById(req.params.band_id, function(err,band) {
			if (err) {res.send(err)}
			if (band) {

				res.render('bandinfo',band);
			}
			else {
				res.sendStatus(404);
			}
		})
	})

// Routing function for an individual objects edit page
router.route('/band/:band_id/edit')

	// POST function for this route, on recieve edited object via form
	.post(isLoggedIn, function(req,res) {
		
		Band.findById(req.params.band_id, function(err,band) {
			if (err) {res.send(err)}
			if (band) {

				// iterate over keys in recieved form, and if anything is edited, change information in object in database
				Object.keys(req.body).forEach(function(key,index) {
					if ([key] in band && req.body[key] != ''){
						if(typeof band[key] != "undefined" && band[key].constructor === Array){
							band[key] = req.body[key].split(',');
						}
						else{
							band[key] = req.body[key];
						}
					}
				});
				// After edit, save and redirect to objects' page again, else send error
				band.save(function(err){
					if(err){res.send(err)}
					else{
						res.redirect('/band/' + req.params.band_id)
					}
				})
			}
			else {
				// if for some reason the edited object is not found, send 404
				res.sendStatus(404);
			}
		})
	})

	// GET function for this route
	.get(isLoggedIn, function(req,res){

		// Find object in database by id and render edit page for object type if found.
		// If not found, send 404
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
	.post(isLoggedIn, function(req,res){
		// On POST-recieve, create a Band Object with body params from form

		Band.find({name:req.body.name}, function(err,old_band){
			if (err) {res.send(err)}
			if (old_band.name != undefined) {res.send("BAND NAME ALREADY EXISTS, ABORTING" + old_band.name)}
			else{
				var name = req.body.name;

				var band = new Band({
    				name:req.body.name,
    				members:req.body.members.split(','),
    				description: req.body.description,
    				previous_concerts:req.body.previous_concerts.replaceAll(' ','').split(','),
					album_sales:req.body.album_sales.replaceAll(' ','').split(','),

					spotify_id: req.body.spotify_id,
					spotify_followers: req.body.spotify_followers,
					spotify_genres: req.body.spotify_genres.split(','),
					spotify_popularity: req.body.spotify_popularity,
					spotify_image: req.body.spotify_image,
    			})

				band.save()

				// Redirect to band page after creation
				res.redirect('/band/' + band._id)
			}
		})
	})

	// GET function for this route, render form for creating this object type
	.get(isLoggedIn, function(req,res){
		res.render('band-form',{});
	});



////////////////////////////////////////////////////////////
// Routing functions for /concerts/
////////////////////////////////////////////////////////////

router.route('/concerts')

	// GET Function for /concerts/
	.get(isLoggedIn, function(req,res){

		// Search database for ALL Concert objects
		Concert.find(function(err, concerts){
			if (err){ res.send(err); }

			// Render found objects with swig and send to client
			console.log(JSON.stringify(concerts))
			res.render('konserttabell', {concerts:concerts,title:'List of concerts'});
		});
	});

router.route('/concert/:concert_id')

	.get(isLoggedIn, function(req,res){

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

//Routing function for editing concert
router.route('/concert/:concert_id/edit')
	
	// POST function for this route, on recieve edited object via form
	.post(isLoggedIn, function(req,res) {
		
		Concert.findById(req.params.concert_id, function(err,concert) {
			if (err) {res.send(err)}
			if (concert) {

				// iterate over keys in recieved form, and if anything is edited, change information in object in database
				Object.keys(req.body).forEach(function(key,index) {
					if ([key]in concert && req.body[key] != ''){
						if(typeof concert[key] != "undefined" && concert[key].constructor === Array){
							concert[key] = req.body[key].split(',');
						}
						else{
							concert[key] = req.body[key];
						}
					}
				});
				// After edit, save and redirect to objects' page again, else send error
				concert.save(function(err){
					if(err){res.send(err)}
					else{
						//res.redirect('/concert/' + req.params.concert_id)

						//There is no dedicated concert page, therefore redirecting to the table
						res.redirect('/concerts');

					}
				})
			}
			else {
				// if for some reason the edited object is not found, send 404
				res.sendStatus(404);
			}
		})
	})



	// Find object in database by id and render edit page for object type if found.
	// If not found, send 404
	.get(isLoggedIn, function(req,res){
		Concert.findById(req.params.concert_id, function(err,concert){
			if (err) {res.send(err)};
			if (concert) {
				res.render('concert-edit', concert);
			}
			else {
				res.sendStatus(404);
			}
		})
	})

// Routing functions for /concerts/create/
router.route('/concerts/create')

	// POST function for /concerts/create/
	.post(isLoggedIn, function(req,res){
		// On POST-recieve, create a Concert Object with body params from form
		var concert = new Concert({
			name:req.body.name,
			bands: req.body.bands.replaceAll(' ','').split(','),
			genre: req.body.genre,
			stage: req.body.stage,
			audSize: req.body.audSize,
			date:req.body.date,
			time:req.body.time,

			bandIDs:[],
			//genres:req.body.genres.replaceAll(' ','').split(','),
		})
		//Skal prøve å søke opp band-navnene oppgitt i databasen, for å lage en link mellom konsert og band
		concert.bands.forEach(function(bandName){
			Band.findOne({'name':bandName},'_id name',function(err,band){
				if (err) {res.send(err)}
				else{
					console.log('FOUND IT! %s %s', band.name, band._id);
					concert.bandIDs.push(band._id);
					concert.save()
				}
			})
		})

		concert.save()

		// Add model other variables for created Concert model
		// ......

		// Send redirect to concert object that was just created
		//res.redirect('/concert/' + concert._id)

		//There is no dedicated concert page, therefore redirecting to the table
		res.redirect('/concerts');
	})

	.get(isLoggedIn, function(req,res){
		res.render('concert-form',{});
	});


//Route for list of bookings
router.route('/bookings')
	.get(isLoggedIn, function(req,res){
		Booking.find(function(err, bookings){
			if (err){ res.send(err); }

			// Render found objects with swig and send to client
			console.log(JSON.stringify(bookings))
			res.render('bookingtabell', {bookings:bookings,title:'List of bookings'});
		});
	})

//Route for creating new bookings
router.route('/bookings/create')
	.post(isLoggedIn, function(req,res){
		var booking = new Booking({
			band_name: "",
			email: "",
			text: "",
			approval: false,
			considered: false,
			price: 0,
			date: "",
		})
		Object.keys(req.body).forEach(function(key,index) {
					if ([key]in booking && req.body[key] != ''){
						if(typeof booking[key] != "undefined" && booking[key].constructor === Array){
							booking[key] = req.body[key].split(',');
						}
						else{
							booking[key] = req.body[key];
						}
					}
				});
		booking.save(function(err){
			if(err){res.send(err)}
			else{
				//res.redirect('/concert/' + req.params.concert_id)

				//There is no dedicated concert page, therefore redirecting to the table
				res.redirect('/bookings');

			}
		})
	})

	.get(isLoggedIn, function(req,res){
		res.render('booking-form',{});
	});

//Route for spesific booking
router.route('/booking/:booking_id')
	.post(isLoggedIn, function(req,res){
		Booking.findById(req.params.booking_id, function(err, booking){
			if (err) {res.send(err)}
			if (booking){

			}
		})
	})

	.get(isLoggedIn, function(req,res){
		Booking.findById(req.params.booking_id, function(err, booking){
			if (err) {res.send(err)}
			if (booking){
				res.render('booking', booking);
			}
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

	// Spotify API URL for getting artist by name-search
	// Name is put between the two strings in the array på String.join(name)
	// All spaces in name need to be replaced with '+'
	var path = ['https://api.spotify.com/v1/search?q=','&type=artist&limit=1'];

	// Function needs to be severly reworked to work with node via callback
	request(path.join(name.replaceAll(' ','+')), function (error, response, body) {
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
}

function spotify_get_artist(id){

	// Spotify API URL for getting artist by ID
	var path = 'https://api.spotify.com/v1/artists/'

	// Function needs to be severly reworked to work with node via callback
	request(path + id, function (error, response, body) {
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
}