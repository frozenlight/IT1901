
var mongoose = require('mongoose');
var shortid = require('shortid');

var ConcertSchema = new mongoose.Schema({
	_id: {type:String,'default':shortid.generate},
	name: String,
	genre: [String],
	bands: Array,
	date: Date,
});

module.exports = mongoose.model('Concert', ConcertSchema);