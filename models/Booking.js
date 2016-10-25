
var mongoose = require('mongoose');
var shortid = require('shortid');

var Band = require('./Band.js')

var BookingSchema = new mongoose.Schema({
	band: {type: mongoose.Schema.ObjectId, ref: 'Band'},
	email: String,
	text: String,
	approval: Boolean,
	considered: Boolean,
	sent: Boolean,
	price: Number,
	date: String,
	url:String,
	concert_created: Boolean,
	messages: Array,
});

module.exports = mongoose.model('Booking', BookingSchema);
