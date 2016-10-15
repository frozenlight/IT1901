
var Stage = require('../models/Stage.js');
//require('../config/passport.js')(passport);


////////////////////////////////////////////////////////////
// Routing functions for /stages/
////////////////////////////////////////////////////////////

module.exports = function(router,passport,isLoggedIn,user){

router.route('/stages')

	// POST function for /stages/
	.post(isLoggedIn, function(res,req){
		// On POST-recieve,
		

		// Add model variables for created Stage model
		// ......

		//Send JSON message back to client
		res.json({message:'Stage created!'})
	})

	// GET Function for /stages/
	.get(isLoggedIn, function(req,res){

		// Search database for ALL stage objects
		Stage.find(function(err, stages){
			if (err){ res.send(err); }

			// Render found objects with swig and send to client 
			console.log(JSON.stringify(stages))
			res.render('stage-table', {stages:stages,title:'List of stages'});
		});
	});

router.route('/stage/:stage_id')

	.get(isLoggedIn, function(req,res){

		Stage.findById(req.params.stage_id, function(err,stage) {
			if (err) {res.send(err)}
			if (stage) {
				res.json(stage);
			}
			else {
				res.sendStatus(404);
			}
		})
	})
	.delete(isLoggedIn, user.can('delete stage'), function(req, res) {
			Stage.findOneAndRemove({'_id' : req.params.stage_id}, function (err, stage) {
        		res.redirect('/stages')
      		})
		})

// Routing functions for /stages/create/
router.route('/stages/create')

	// POST function for /stages/create/
	.post(isLoggedIn, function(req,res){
		// On POST-recieve, create a Stage Object with body params from form

		var stage = new Stage({
				name: "",
				price: "",
				capacity: "",
				concerts: [],
				color:"",
			})

			Object.keys(req.body).forEach(function (key, index) {
				if ([key]in stage && req.body[key] != '') {
					if (typeof stage[key] != 'undefined' && stage[key].constructor === Array) {
						stage[key] = req.body[key].split(',')
					} else {
						stage[key] = req.body[key]
					}
				}
			})

			stage.save(function (err) {
				if (err) {
					res.send(err)
				} else {
					res.redirect('/stages')
				}
			})

		// Add model other variables for created Stage model
		// ......

		// Send redirect to newly created stage object
		//res.redirect('/stage/' + stage._id)
	})

	.get(isLoggedIn, function(req,res){
		res.render('stage-form',{});
	});

}