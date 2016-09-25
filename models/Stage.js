
var mongoose = require('mongoose');
var shortid = require('shortid');

var StageSchema = new mongoose.Schema({
	_id: {type:String,'default':shortid.generate},
	name: String,
	price: String,
	capacity: String,
	concerts: [String],
});

module.exports = mongoose.model('Stage', StageSchema);