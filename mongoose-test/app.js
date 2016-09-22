
// load mongoose package
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var swig = require('swig');
var Scene = require('./models/Scene.js')


// Use native Node promises
//mongoose.Promise = global.Promise;

var app = express();

// connect to MongoDB
mongoose.connect('mongodb://localhost/more-testing');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


// Set swig to be the standard template engine for express
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

var router = express.Router();

router.use(function(req,res,next){
	console.log('Something is happening.');
	next()
})

app.use('/', router);

router.route('/scenes')
	.post(function(res,req){
		Scene.create()
		res.json({message:'Scene created!'})
	})
	.get(function(req,res){
		Scene.find(function(err, scenes){
			if (err){
				res.send(err);
			}
			res.render('scene-table', {scenes:scenes,title:'List of scenes'});
		});
	});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.get('/form',function(req,res){
	res.sendFile(__dirname + '/templates/form.html');
})

app.post('/form', function(req, res) {
	console.log(req.body.name);
    var name = req.body.name,
        price = req.body.price;
        capacity = req.body.capacity
    console.log(name + ' | ' + price + ' | ' + capacity)
    Scene.create({
    	name:name,
    	capacity:capacity,
    	price:price,
    });

});

app.get('/:', function(req,res){
	Scene.find({name:'storsalen'},function(err,data){
		if (err) return console.error(err);
  		console.log(JSON.stringify(data));
  		res.send(JSON.stringify(data))
	})

});

app.listen(8000, function(){
	console.log('Express server running at port 8000')
})