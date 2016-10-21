
var Booking = require('../models/Booking.js')
var Band = require('../models/Band.js')
//require('../config/passport.js')(passport);

var nimble = require('nimble')



////////////////////////////////////////////////////////////
//Route for list of bookings
////////////////////////////////////////////////////////////

module.exports = function (router, passport, isLoggedIn, user) {

	// Route for '/bookings'
	router.route('/bookings')

		// handles all GET requests for route '/bookings'
		.get(isLoggedIn, user.can('see bookings'), function(req, res) {

			// If the user is a manager or a band user, only the objects which correspond with the user should be loaded
			if (['manager','band'].indexOf(req.user.role) >= 0) {

				// Find all bands in the Booking collection
				Booking.find()

					// Populate all the band fields in the booking objects recieved
					.populate('band')

					// Exectute function with the array of bookings from the query
					.exec(function (err, bookings) {

						// If there is an error with the query, send the error message to the client
						if (err) {
							res.send(err)
						}

						//TESTING **REMOVE**

						for (let i = 0; i<bookings.length; i++) {
							if (req.user.connected_band == bookings[i].band.id) {
								console.log('CONNECTED BAND ID: ' + req.user.connected_band + ' == ' + bookings[i].band.id + ' EQUALS true')
							} else {
								console.log('CONNECTED BAND ID: ' + req.user.connected_band + ' == ' + bookings[i].band.id + ' EQUALS false')	
							}
						}

						//ENDTEST ** REMOVE**

						// Use lambda to filter out all the bookings band or manager shouldn't have access to
						let connected_bookings = bookings.filter(booking => booking.band.id == req.user.connected_band)

						// render the same view as usual, but with the limited selection of bookings
						res.render('bookingtabell', {bookings:connected_bookings})
					})

			// If user is not manager or band user
			} else {

				//Find all Booking objects
				Booking.find()
					.populate('band')
					.exec(function (err, bookings) {
						if (err) {
							res.send(err)
						}

						// Render found objects with swig and send to client
						console.log(JSON.stringify(bookings))

						res.render('bookingtabell', {bookings:bookings,title:'List of bookings'})
					})
			}
		})

	//Route for creating new bookings
	router.route('/bookings/create')
		.post(isLoggedIn, function (req, res) {

			var booking = new Booking({
				email: '',
				text: '',
				approval: false,
				considered: false,
				concert_created:false,
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
			//booking.url = booking.date+'-'+booking.id.slice(0,5)
			booking.band = req.body.band

			console.log('BOOKING BAND: '+booking.band)
			Band.findOne(booking.band, function (err, band) {
				band.bookings.push(booking._id)
				band.save()

				booking.url = booking.date+'-'+band.name

				booking.save(function (err) {
					if (err) {
						res.send(err)
					} else {
						res.redirect('/bookings')
					}
				})
			})

			/*booking.save(function (err) {
				if (err) {
					res.send(err)
				} else {
					res.redirect('/bookings')
				}
			})*/
		})

		.get(isLoggedIn, function (req, res) {
			Band.find()
				.populate('band')
				.exec(function (err, bands) {
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

					if (req.user.role === 'admin' || req.user.role === 'bookingsjef') {

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
