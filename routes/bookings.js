
var Booking = require('../models/Booking.js');
//require('../config/passport.js')(passport);



////////////////////////////////////////////////////////////
//Route for list of bookings
////////////////////////////////////////////////////////////

module.exports = function(router,passport,isLoggedIn){
router.route('/bookings')
	.get(isLoggedIn, function(req,res){

		//Find all Booking objects
		Booking.find(function(err, bookings){
			if (err){ res.send(err); }

			// Render found objects with swig and send to client
			console.log(JSON.stringify(bookings))
			res.render('bookingtabell', {bookings:bookings,title:'List of bookings'});
		});
	});

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
				Object.keys(req.body).forEach(function(key,index){
					if([key] in booking && req.body[key] != ''){
						booking[key] = req.body[key];
					}
				})

				if(req.body.confirm == "accept"){
					booking.approval = true;
				}
				booking.considered = true;

				booking.save(function(err){
					if(err){res.send(err)}
					else{
						res.redirect('/booking/'+req.params.booking_id);
					}
				})
			}
		})
	})

	.get(isLoggedIn, function(req,res){
		Booking.findById(req.params.booking_id, function(err, booking){
			if (err) {res.send(err)}
			if (booking){
				res.render('booking', booking);
				//res.json(booking);
			}
		})
	})
}