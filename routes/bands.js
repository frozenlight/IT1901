
var Band = require('../models/Band.js');
//var replaceAll = require('./prototypes.js')

////////////////////////////////////////////////////////////
// Routing functions for /bands/
////////////////////////////////////////////////////////////

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

module.exports = function(router,passport,isLoggedIn,user){

	router.route('/bands')

		// GET Function for /bands/
		.get(isLoggedIn, function(req,res){

			// Search database for ALL stage objects
			Band.find(function(err, bands){
				if (err){ res.send(err); }

				// Render found objects with swig and send to client 
				console.log(JSON.stringify(bands))
				res.render('bandliste', {bands:bands,title:'List of bands'});
			});
		});

	// Routing function for an individual band object
	router.route('/band/:band_id')

		.get(isLoggedIn, function(req,res){

			// Find object by its' id and render page to user, if not found send 404
			Band.findById(req.params.band_id, function(err,band) {
				if (err) {res.send(err)}
				if (band) {

					res.render('bandinfo',band);
				}
				else {
					res.sendStatus(404);
				}
			})
		})

	// Routing function for an individual objects edit page
	router.route('/band/:band_id/edit')

		// POST function for this route, on recieve edited object via form
		.post(isLoggedIn, function(req,res) {
			
			Band.findById(req.params.band_id, function(err,band) {
				if (err) {res.send(err)}
				if (band) {

					// iterate over keys in recieved form, and if anything is edited, change information in object in database
					Object.keys(req.body).forEach(function(key,index) {
						if ([key] in band && req.body[key] != ''){
							if(typeof band[key] != "undefined" && band[key].constructor === Array){
								band[key] = req.body[key].split(',');
							}
							else{
								band[key] = req.body[key];
							}
						}
					});
					// After edit, save and redirect to objects' page again, else send error
					band.save(function(err){
						if(err){res.send(err)}
						else{
							res.redirect('/band/' + req.params.band_id)
						}
					})
				}
				else {
					// if for some reason the edited object is not found, send 404
					res.sendStatus(404);
				}
			})
		})

		// GET function for this route
		.get(isLoggedIn, function(req,res){

			// Find object in database by id and render edit page for object type if found.
			// If not found, send 404
			Band.findById(req.params.band_id, function(err,band) {
				if (err) {res.send(err)}
				if (band) {

					res.render('band-edit',band);
				}
				else {
					res.sendStatus(404);
				}
			})
		})

		.delete(isLoggedIn,user.can('delete bands'),function(req,res){
			console.log('Request: BAND DELETE')
			Band.findByIdAndRemove(req.params.band_id)
		})

	// Routing functions for /bands/create/
	router.route('/bands/create')

		// POST function for /bands/create/
		.post(isLoggedIn, function(req,res){
			// On POST-recieve, create a Band Object with body params from form

			Band.find({name:req.body.name}, function(err,old_band){
				if (err) {res.send(err)}
				if (old_band.name != undefined) {res.send("BAND NAME ALREADY EXISTS, ABORTING" + old_band.name)}
				else{
					var name = req.body.name;

					var band = new Band({
	    				name:"",
	    				members:[],
	    				description:"",
	    				previous_concerts:[],
						album_sales:[],

						spotify_id: "",
						spotify_followers:"",
						spotify_genres:[],
						spotify_popularity:"",
						spotify_image:"",
	    			})

	    			Object.keys(req.body).forEach(function(key,index) {
						if ([key] in band && req.body[key] != ''){
							if(typeof band[key] != "undefined" && band[key].constructor === Array){
								band[key] = req.body[key].split(',');
							}
							else{
								band[key] = req.body[key];
							}
						}
					});

					band.save()

					// Redirect to band page after creation
					res.redirect('/band/' + band._id)
				}
			})
		})

		// GET function for this route, render form for creating this object type
		.get(isLoggedIn, function(req,res){
			res.render('band-form',{});
		});

}
