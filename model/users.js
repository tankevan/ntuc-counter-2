'use strict';

//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an 
//object that shows the shape of your database entries.
var UsersSchema = new Schema({
 enter_queue_time: { value: Date,
                     clicked: Boolean },
 start_service_time: { value: Date,
                       clicked: Boolean },
 leave_service_time: { value: Date,
                       clicked: Boolean },
 station_no: { type: Number, default: 0},
 age: { type: Number, default: 0 },
 item_no: { type: Number, default: 0 },
 collector_no: { type: Number, default: 0 }
});

//export our module to use in server.js
module.exports = mongoose.model('User', UsersSchema);