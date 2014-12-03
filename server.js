/**
 * Created by Gaurav Kesarwani on 11/17/2014.
 */

//call the needed packages

var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var uriUtil = require('mongodb-uri');

var application_root = __dirname;
//configure app to use body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//configure to use static files
app.use(express.static(path.join(application_root,"app/static")));


//configure mongodb

var mongodbUri = 'mongodb://localhost:27017/moviedb';
var mongo = require('mongodb');
var mongoose = require('mongoose');

var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri);
var conn = mongoose.connection;
//mongoose.connect();

conn.on('error', console.error.bind(console, 'connection error:'));
var port = process.env.PORT || 8000;


// Routes for our API
//-------------------------------------------------------------------------------
var router = express.Router(); //get an instance of express router

router.get('/',function(request,response) {
    response.json({message: 'Server running'});
});

app.use('/api',router);

//once the db connection is open, start the app
conn.once('open', function(){
    app.listen(port);
    console.log("server listening on port 8000")
});