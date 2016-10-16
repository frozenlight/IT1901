
var Concert = require('../models/Concert.js')
var Stage = require('../models/Stage.js')
var Band = require('../models/Band.js')
var Booking = require('../models/Booking.js')

////////////////////////////////////////////////////////////
// Routing functions for /api/
// The API is used to give frontend access to database information
// with read-only access to the models and other information we choose
////////////////////////////////////////////////////////////

module.exports = function(router){

	router.route('/api')
		.get(function(req,res){
			res.send("This is our API page, it should be free to use to get information")
		})

	router.route('/api/concerts')
		.get(function(req,res){
			Concert.find()
				.populate('stage')
				.populate('bands')
				.exec(function (err, concerts) {
				if (err) {
						res.send(err)
					}
					res.json(concerts)
				})
		})

	router.route('/api/concert/:name')
		.get(function (req, res) {
			Concert.findOne({'name':req.params.name})
				.populate('stage')
				.populate('bands')
				.exec(function (err, concert) {
					if (err) {
						res.send(err)
					}
					res.json(concert)
				})
		})

	router.route('/api/stages')
		.get(function(req,res){
			Stage.find()
				.populate('bands')
				.populate('concerts')
				.exec(function (err, stages) {
					if (err) {
						res.send(err)
					}
					res.json(stages)
				})
		})

	router.route('/api/bookings')
		.get(function(req,res){
			Booking.find()
				.populate('band')
				.exec(function (err, bookings) {
					if (err) {
						res.send(err)
					}
					res.json(bookings)
				})
		})

	router.route('/api/bands')
		.get(function(req,res){
			Band.find()
				.populate('concerts')
				.populate('bookings')
				.populate('stages')
				.exec(function (err, bands) {
					if (err) {
						res.send(err)
					}
					res.json(bands)
				})
		})

	router.route('/api/band/:band_id')
		.get(function (req, res) {
			Band.findById(req.params.band_id, function (err, band) {
				if (err) {
					res.send(err)
				}
				res.json(band)
			})
		})

	router.route('/api/stage')
		.get(function(req,res){
			var key = Object.keys(req.query)[0]
			var other = req.query[key]
			console.log("SEARCH:   "+key)
			console.log("PARAM:    "+other)
			Stage.findOne({key:other},function(err,stage){
				if(err){res.send(err)}
				if(stage == undefined){
					res.send("undefined")
				} else {
					console.log(JSON.stringify(stage))
					res.json(stage)
				}
			})
		})
	}