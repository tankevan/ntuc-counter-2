//server.js
'use strict'

//first we import our dependencies…
var express = require('express');
const path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./model/users');

//and create our instances
var app = express();
var router = express.Router();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

//set our port to either a predetermined port number if you have set 
//it up, or 3001
var port = process.env.PORT || 3001;
var USERNAME = process.env.USERNAME;
var PASSWORD = process.env.PASSWORD;

//db config
mongoose.connect(`mongodb://${USERNAME}:${PASSWORD}@ds117719.mlab.com:17719/ntuc-counter`);

//now we should configure the API to use bodyParser and look for 
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// if (process.env.NODE_ENV === 'production') {
// app.use(express.static('./build'));
// }

//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

//and remove cacheing so we get the most recent comments
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

//now we can set the route path & initialize the API
router.get('/', function(req, res) {
 res.json({ message: 'API Initialized!'});
});

router.route('/:collector_no/users')
  .get(function(req, res) {
    User.find({ "collector_no": req.params.collector_no}, function(err, users) {
      if (err) res.send(err);
      res.json(users);
    });
  })
  .post(function(req, res) {
    var user = new User();
    user.enter_queue_time = req.body.enter_queue_time;
    user.start_service_time = req.body.start_service_time;
    user.leave_service_time = req.body.leave_service_time;
    user.station_no = req.body.station_no;
    user.age = req.body.age;
    user.item_no = req.body.item_no;
    user.collector_no = req.params.collector_no;

    user.save(function(err) {
      if (err) res.send(err);
      res.json({ message: 'User has been created' });
    });
  });
router.route('/users/:user_id')
  .put(function(req,res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);
      (req.body.enter_queue_time) ? user.enter_queue_time = req.body.enter_queue_time : null;
      (req.body.start_service_time) ? user.start_service_time = req.body.start_service_time : null;
      (req.body.leave_service_time) ? user.leave_service_time = req.body.leave_service_time : null;
      (req.body.station_no) ? user.station_no = req.body.station_no : null;
      (req.body.age) ? user.age = req.body.age : null;
      (req.body.item_no) ? user.item_no = req.body.item_no : null;
      
      user.save(function(err) {
        if (err) res.send(err);
        res.json({ message: 'User has been updated' });
      });
    });
  })
  .delete(function(req, res) {
    User.remove({ _id: req.params.user_id }, function(err, user) {
      if (err) res.send(err);
      res.json({ message: 'User has been deleted' });
    });
  });

//Use our router configuration when we call /api
app.use('/api', router);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

//starts the server and listens for requests
app.listen(port, function() {
 console.log(`api running on port ${port}`);
});