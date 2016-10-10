
//require('../config/passport.js')(passport);


var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

module.exports = function(app){

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
}
