
var mongoose = require('mongoose');
var shortid = require('shortid');

var StageSchema = new mongoose.Schema({
	name: String,
	price: String,
	capacity: String,
	concerts: [String],
	color:String,
    image:String,
	bands:[{type: mongoose.Schema.ObjectId, ref: 'Band'}],
	Concerts:[{type: mongoose.Schema.ObjectId, ref: 'Band'}],
});

module.exports = mongoose.model('Stage', StageSchema);