
var Booking = require('../models/Booking.js')
var Band = require('../models/Band.js')
//require('../config/passport.js')(passport);

var nimble = require('nimble')



////////////////////////////////////////////////////////////
//Route for list of bookings
////////////////////////////////////////////////////////////

module.exports = function (router, passport, isLoggedIn, user) {
	router.route('/bookings')
		.get(isLoggedIn, function(req, res) {

			//Find all Booking objects
			Booking.find().populate('band').exec(function (err, bookings) {
				if (err) {
					res.send(err)
				}

				// Render found objects with swig and send to client
				console.log(JSON.stringify(bookings))

				res.render('bookingtabell', {bookings:bookings,title:'List of bookings'})
			})
		})

	//Route for creating new bookings
	router.route('/bookings/create')
		.post(isLoggedIn, function (req, res) {

			var booking = new Booking({
				email: '',
				text: '',
				approval: false,
				considered: false,
				price: 0,
				date: '',
			})

			Object.keys(req.body).forEach(function (key, index) {
				if ([key]in booking && req.body[key] != '') {
					if (typeof booking[key] != 'undefined' && booking[key].constructor === Array) {
						booking[key] = req.body[key].split(',')
					} else {
						booking[key] = req.body[key]
					}
				}
			})
			booking.url = booking.date+'-'+booking.id.slice(0,5)
			booking.band = req.body.band

			console.log('BOOKING BAND: '+booking.band)
			Band.findOne(booking.band, function (err, band) {
				band.bookings.push(booking._id)
				band.save()
			})

			booking.save(function (err) {
				if (err) {
					res.send(err)
				} else {
					res.redirect('/bookings')
				}
			})
		})

		.get(isLoggedIn, function (req, res) {
			Band.find(function (err, bands) {
				if (err) {
					res.send(err)
				}
				res.render('booking-form',{bands:bands})
			})
		})

	//Route for spesific booking
	router.route('/booking/:url')
		.post(isLoggedIn,function (req, res) {
			Booking.findOne({'url':req.params.url}, function (err, booking) {
				if (err) {
					res.send(err)
				}
				if (booking) {
					Object.keys(req.body).forEach(function (key, index) {
						if ([key] in booking && req.body[key] != '') {
							booking[key] = req.body[key]
						}
					})

					if (req.user.role === 'admin' || req.user.role === 'booking_boss') {

						console.log('user access:'+req.user.role)

						console.log(req.body.confirm)

						if (req.body.confirm == 'accept') {
							console.log('Setting approved')
							booking.approval = true
						} else if ( req.body.confirm == 'deny' ) {
							console.log('Setting denied')
							booking.approval = false
						}
						console.log('Setting concidered to true')

						booking.considered = true

						if (req.body.sent == 'yes') {
							booking.sent = true
							console.log('mailto checkbox checked')
						} else {
							booking.sent = false
						}
					} else {
						console.log('Attempted to override with rouge POST request, access blocked because of auth')
						req.flash({message:'Du har ikke tilgang til å endre Godkjent/ikke-godkjent feltet!'})
					}


					
					booking.save(function (err) {
						if (err) {
							res.send(err)
						} else {
							res.redirect('/booking/'+req.params.url)
						}
					})
				}
			})
		})

		.get(isLoggedIn, function (req, res) {
			Booking.findOne({'url':req.params.url})
				.populate('band')
				.exec(function (err, booking) {
					if (err) {
						res.send(err)
					}
					if (booking) {
						console.log('Getting to A BOOKING')
						res.render('booking', {booking:booking})
						//res.json(booking)
					} else {
						console.log('NOT FINDING THE FUCKING BOOKING')
					}
				})
		})
		.delete(isLoggedIn, user.can('delete booking'), function(req, res) {
			Booking.findOneAndRemove({'url' : req.params.url}, function (err, booking) {
        		res.redirect('/bookings')
      		})
		})
}
