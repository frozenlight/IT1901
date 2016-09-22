
var mongoose = require('mongoose');

var ConcertSchema = new mongoose.Schema({
	name: String,
	genre: [String],
	bands: Array,
	date: Date,
});

module.exports = mongoose.model('Concert', ConcertSchema);