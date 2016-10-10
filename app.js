
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

var ConnectRoles = require('connect-roles');

// Import models for mongoose
var Stage = require('./models/Stage.js');
var Concert = require('./models/Concert.js');
var Band = require('./models/Band.js');
var Booking = require('./models/Booking.js');

var isLoggedIn = require('./config/passport_function.js')


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

// roles role initialization for connect-roles
var roles = new ConnectRoles({
  failureHandler: function (req, res, action) {
    // optional function to customise code that runs when 
    // user fails authorisation 
    var accept = req.headers.accept || '';
    res.status(403);
    if (~accept.indexOf('html')) {
      res.render('access-denied', {action: action});
    } else {
      res.send('Access Denied - You don\'t have permission to: ' + action);
    }
  }
});

// setup for passport.js
app.use(session({secret: 'rainbowsandshit'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login in sessions
app.use(flash()); // use connect-flash for flash messages

// Middleware for connect-roles
app.use(roles.middleware());
//moderator users can access private page, but 
//they might not be the only ones so we don't return 
//false if the user isn't a moderator 
roles.use('access private page', function (req) {
  if (req.user.role === 'moderator') {
    return true;
  }
})
 
//admin users can access all pages 
roles.use(function (req) {
  if (req.user.role === 'admin') {
    return true;
  }
});


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

		res.render('front', {concerts:JSON.stringify(concerts),user:req.user});
	});
});

require('./routes/api.js')(router,roles)
require('./routes/bands.js')(router,passport,isLoggedIn,roles)
require('./routes/bookings.js')(router,passport,isLoggedIn,roles)
require('./routes/concerts.js')(router,passport,isLoggedIn,roles)
require('./routes/stages.js')(router,passport,isLoggedIn,roles)
require('./routes/passport.js')(app,router,isLoggedIn,roles)

require('./routes/prototypes.js')


////////////////////////////////////////////////////////////
// Run Express server
////////////////////////////////////////////////////////////

// Select which port to run the server on
var port = 8000;

app.listen(port, function(){
	console.log('Express server running at port ' + port);
})

