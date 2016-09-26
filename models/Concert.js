
var mongoose = require('mongoose');
var shortid = require('shortid');

var ConcertSchema = new mongoose.Schema({
	_id: {type:String,'default':shortid.generate},
	name: String,
	genre: String,
	bands: [String],
	date: String,
	time: String,
});

module.exports = mongoose.model('Concert', ConcertSchema);