
var mongoose = require('mongoose');
var shortid = require('shortid');

var BookingSchema = new mongoose.Schema({
	_id: {type:String,'default':shortid.generate},
	band_name: String,
	email: String,
	text: String,
	approval: Boolean,
	considered: Boolean,
	sent: Boolean,
	price: Number,
	date: String,
});

module.exports = mongoose.model('Booking', BookingSchema);
