
var mongoose = require('mongoose');

var SceneSchema = new mongoose.Schema({
	name: String,
	price: String,
	capacity: String,
	concerts: Array,
});

module.exports = mongoose.model('Scene', SceneSchema);