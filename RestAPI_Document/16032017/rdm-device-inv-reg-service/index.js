/*
File :- index.js
Description :- This file is entry point of our system. All the apis's used and the global variables shared across
service are included in this file. Also the database connection creation and rabbit-mq listener methods are included 
in this file.
Created Date :- 07-03-2017
Modify Date :- 07-03-2017
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var amqp = require('amqplib/callback_api');
var bodyParser = require('body-parser');
var path = require('path');
var cassandra = require('cassandra-driver');
var jwt = require("jsonwebtoken");
var mergeJSON = require("merge-json");
var expressValidator = require("express-validator");
var moment = require("moment");
var promise = require("bluebird");
var returnmsg = "";

/* Configuration detail */
var config = require("./config");

/* Error listing file */
var error = require("./error");

/* Function to check error or success and return error message */
var response = require("./error-success/error_success.js");

/* Validation schema */
var validation = require("./validation/validation.js")(mergeJSON, error);

/* bodyParser middleware check that Request body data contain proper json format or not */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }), function (err, req, res, next) {
	if (err) {
		returnmsg = response.errorresponse(error.jsonformat);
		res.status(400).send(returnmsg);
	} else {
		next();
	}
});
/* Custom validation to check data is in proper format or not */
app.use(expressValidator({
	customValidators: {
		isobject: function (value) {
			if (typeof value == 'object') {
				return true
			} else {
				return false
			}
		},
		isstring: function (value) {
			if (typeof value == 'string') {
				return true
			} else {
				return false
			}
		},
		isempty: function (value) {
			if (value != undefined && value.trim().length > 0) {
				return true
			} else {
				return false
			}
		},
		isemptyobject: function (value) {
			if (value != undefined && Object.keys(value).length > 0) {
				return true
			} else {
				return false
			}
		}
	}
}));

/* Set path for different API modules */
app.set('apis', path.join(__dirname, 'apis'));
app.set('middleware', path.join(__dirname, 'middleware'));
app.set('error-success', path.join(__dirname, 'error-success'));
app.set('validation', path.join(__dirname, 'validation'));

// Database Connection setup
const client = new cassandra.Client({
	contactPoints: [config.databaseip],
	keyspace: config.databasename
});

client.connect(function (err) {
	if (err) {
		console.log("errormessage : " + err);
	} else {
		console.log("connection done successfully");
	}
})

// Middleware configuration
require("./middleware/middleware.js")(app, bodyParser, client, config, jwt, error, response);
// Load Device API's
require('./apis/device_registration/deviceregistration.js')(app, client, cassandra, error, response, validation, moment, config, promise);

require('./apis/device_type/devicetype.js')(app, client, config, error, jwt, response);

// RabbitMQ connection setup
var queue = config.channel.toString();
amqp.connect(config.rabbitmqurl, function (err, conn) {
	// Create channel in RabbitMQ
	conn.createChannel(function (err, ch) {
		ch.assertQueue(queue, {
			durable: false
		});
		console.log("Listener Started successfully");
		// Consume data from Queue
		ch.consume(queue, function (msg) {
			try {
				var msgdata = JSON.parse(msg.content.toString());
				verifydevice(msgdata);
			} catch (err) {
				// Error message in response if error is occurred during
				returnmsg = response.errorresponse(err);
				console.log(returnmsg);
			}
		}, {
				noAck: true
			});
	});
});
// Function that verify device is already registered or not
function verifydevice(msgdata) {
	var deviceinfolist = msgdata.devices;
	var count = 0;
	for (var i = 0, len = deviceinfolist.length; i < len; i++) {

		var query = "SELECT devicedbid FROM tbl_deviceInfo where deviceid= '"
			+ deviceinfolist[i].deviceid + "' ALLOW FILTERING";
		// Execute query in cassandra using its client object
		client.execute(query, function (err, result) {
			if (!err) {
				if (result.rows.length > 0) {
					// Device already registered
					returnmsg = response
						.errorresponse(error.deviceidindeviceinfo);
					console.log(returnmsg);
				} else {
					// Insert device data in available devices table
					insertdevicedata(deviceinfolist[count]);
					count++;
				}
			} else {
				// Error message in response if error is occurred during
				// during database operation.
				returnmsg = response.errorresponse(err);
				console.log(returnmsg);
			}

		})
	}
}
// Function for inserting the data of registered device in available device
// information table
function insertdevicedata(deviceInfo) {
	var id = cassandra.types.Uuid.random();
	var date = moment.utc().format();
	// Fetch data table name from deviceInfo table
	var query = "SELECT avldevicedbid FROM tbl_available_dev_info where deviceid= '"
		+ deviceInfo.deviceid + "' ALLOW FILTERING";
	// Execute query in cassandra
	client.execute(query,
		function (err, result) {
			if (!err) {
				if (result.rows.length > 0) {
					// Device already available devices list
					returnmsg = response
						.errorresponse(error.deviceidintemp);
					console.log(returnmsg);
				} else {

					var query = 'INSERT INTO tbl_available_dev_info (avldevicedbid,deviceid,proto,category,gatewayid,data,create_ts,schematype) VALUES (?,?,?,?,?,?,?,?) USING TTL '
						+ config.ttlfortemp;
					const params = [id, deviceInfo.deviceid, deviceInfo.proto, deviceInfo.devicetype, JSON.stringify(deviceInfo.gatewayid), JSON.stringify(deviceInfo.data), date, deviceInfo.schematype];

					// Execute query in cassandra
					client.execute(query, params, {
						prepare: true
					},
						function (err) {
							if (!err) {
								// Return success message in
								// response
								returnmsg = response
									.successresponse(
									error.success,
									null);
								console.log(returnmsg);
							} else {
								// Error message in response if
								// error is occurred during
								// during database operation.
								returnmsg = response
									.errorresponse(err);
								console.log(returnmsg);
							}
						});
				}
			} else {
				returnmsg = response.errorresponse(err);
				console.log(returnmsg);
			}
		});
}
// PORT declaration
app.set('port', process.env.PORT || config.serverport);
server.listen(app.get('port'), function (err) {
	if (err) {
		console.log('Server is Not Started');
	} else {
		console.log('Server successfully Started on PORT ' + app.get('port'));
	}
});
