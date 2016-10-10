
var Concert = require('../models/Concert.js')
////////////////////////////////////////////////////////////
// Routing functions for /api/
// The API is used to give frontend access to database information
// with read-only access to the models and other information we choose
////////////////////////////////////////////////////////////
module.exports = function(router){
	router.route('/api/')
		.get(function(req,res){
			res.send("This is our API page, it should be free to use to get information")
		})

	router.route('/api/concerts')
		.get(function(req,res){
			Concert.find(function(err,concerts){
				if (err) { res.send(err) }
				res.json(concerts)
			})
		})
	}