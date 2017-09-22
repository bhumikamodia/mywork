/*
File :- deviceregistration.js
Description :- This file is used to register device in table.
Using this  file we can regiser device,update device detail,get device detail.
Created Date :- 14-03-2017
Modify Date :- 14-03-2017
*/
module.exports = function (app, client, cassandra, error, response, validation, moment, config, promise) {

	var returnmsg = "";
	// This api is use for getting available device info
	app.get('/registration/availabledevices', function (req, res) {
		var query = "Select * from tbl_available_dev_info";
		// get device id from query parameter
		if (req.query.deviceid != undefined) {
			var deviceid = req.query["deviceid"];
			query += " where deviceid='" + deviceid + "' ALLOW FILTERING";
		}
		// query execution for getting available device detail
		client.execute(query, function (err, result) {
			if (err) {
				// Return error message in response if error is occured during database operation.
				returnmsg = response.errorresponse(err.message.replace(/"/g, " "));
				res.status(500).send(returnmsg);
			}
			else {
				// Return result set if database operation completed successfully.
				returnmsg = response.successresponse(error.success, result.rows);
				res.status(200).send(returnmsg);
			}
		});
	});
	// This API is used for Device registration
	app.post('/registration/device', function (req, res) {
		// check device is registerd
		var query = "Select * from tbl_deviceinfo where deviceid='" + req.body.deviceid + "' ALLOW FILTERING";
		client.execute(query, function (err, result) {
			if (err) {
				// Return error message in response if error is occured during database operation.
				returnmsg = response.errorresponse(err);
				res.status(500).send(returnmsg);
			}
			else {
				if (result.rows.length > 0) {
					// Return error message in response if device info already registerd.
					returnmsg = response.errorresponse(error.deviceregisterd);
					res.status(400).send(returnmsg);
				}
				// Insert Device
				else {
					// check device detail is valid
					var schema = validation.validationcheck("/registration/device", "POST");
					req.checkBody(schema);
					req.getValidationResult().then(function (result) {
						var errors = result.useFirstErrorOnly().array();
						if (errors.length > 0) {
							// Return error message in response if request data is not valid.
							returnmsg = response.errorresponse(errors);
							res.status(400).send(JSON.stringify(returnmsg));
						}
						else {
							// Register new device if request data is valid.
							updateorinsertdevice(req, res, "insert");
						}
					})
				}
			}
		});
	});
	// This API is used for Device detail update
	app.put('/registration/device', function (req, res) {
		// check device detail is valid
		var schema = validation.validationcheck("/registration/device", "PUT");
		req.checkBody(schema);
		req.getValidationResult().then(function (result) {
			var errors = result.useFirstErrorOnly().array();
			if (errors.length > 0) {
				// Return error message in response if request data is not valid.
				returnmsg = response.errorresponse(errors);
				res.status(400).send(JSON.stringify(returnmsg));
			}
			else {
				// Update device if request data is valid.
				updateorinsertdevice(req, res, "update");
			}
		})
	});
	function updateorinsertdevice(req, res, action) {
		var deviceid = req.body.deviceid;
		var createby = req.authorization.emailid;
		var keyspace = config.databasename;
		// create dynamic table name
		var devicetblname = "";
		if (req.body.type != undefined) {
			devicetblname = config.datatablenameprefix + req.body.type.toLowerCase();
		}
		else {
			devicetblname = "";
		}
		if (req.body.type != undefined) {
			// check device type is available
			var query = "SELECT * FROM tbl_device_type where devicetype ='" + req.body.type + "' ALLOW FILTERING";
			// query execution
			client.execute(query, function (err, result) {
				if (err) {
					// Return error message in response if error is occured during database operation.
					returnmsg = response.errorresponse(err);
					res.status(500).send(returnmsg);
				}
				else {
					// alter table if device type is available
					if (result.rows.length > 0) {
						alterdatatable(req, res).then(function (returnmsg) {
							if (action == "update") {
								updatedeviceinfo(req, res);
							}
							else {
								insertdeviceinfo(req, res);
							}

						})
					}
					//create table and create new type if type is not available
					else {
						var typeid = cassandra.types.Uuid.random();
						var query = 'INSERT INTO tbl_device_type (devicetypedbid,devicetype,create_ts,created_by,mod_ts,mod_by,isactive) VALUES (?,?,?,?,?,?,?)';
						//paramter detail
						const params = [typeid, req.body.type, moment.utc().format(), createby, null, null, true]
						//query execution for inserting device detail
						client.execute(query, params, { prepare: true }, function (err, result) {
							if (err) {
								// Return error message in response if error is occured during database operation.
								returnmsg = response.errorresponse(err);
								res.status(500).send(returnmsg);
							}
							else {
								//Return success message if device type is inserted successfully
								createdatatable(req, res).then(function (returnmsg) {
									if (action == "update") {
										updatedeviceinfo(req, res);
									}
									else {
										insertdeviceinfo(req, res);
									}
								});
							}
						});
					}
				}
			});
		}
		else {
			if (action == "update") {
				updatedeviceinfo(req, res);
			}
			else {
				insertdeviceinfo(req, res);
			}
		}
	}
	///Insert Device info
	function insertdeviceinfo(req, res) {
		var id = cassandra.types.Uuid.random();
		var deviceid = req.body.deviceid;
		var devicetblname = "";
		if (req.body.type != undefined) {
			devicetblname = config.datatablenameprefix + req.body.type.toLowerCase();
		}
		else {
			devicetblname = "";
		}
		var createby = req.authorization.emailid;
		//query for device detail insertion
		var query = 'INSERT INTO tbl_deviceinfo (devicedbid,deviceid,proto,category,gatewayid,devicedatatb,data,create_ts,created_by,mod_ts,mod_by,isactive,schematype,type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		//paramter detail
		const params = [id, deviceid, req.body.proto, req.body.category, JSON.stringify(req.body.gatewayid), devicetblname, JSON.stringify(req.body.data), moment.utc().format(), createby, null, null, true, req.body.schematype, req.body.type]
		//query execution for inserting device detail
		client.execute(query, params, { prepare: true }, function (err, result) {
			if (err) {
				// Return error message in response if error is occured during database operation.
				returnmsg = response.errorresponse(err);
				res.status(500).send(returnmsg);
			}
			else {
				//Return success message if device is inserted successfully
				returnmsg = response.successresponse(error.success, JSON.parse('{"deviceid":"' + deviceid + '"}'));
				res.status(201).send(returnmsg);
			}
		});
	}
	///Update Device info
	function updatedeviceinfo(req, res) {
		var qparam = "", devicedbid = "";
		devicedbid = req.headers['x-devicedbid'];
		deviceid = req.headers['x-deviceid'];
		// generate dynamic query for update
		for (var key in req.body) {
			if (key == "deviceid" || key == "columnsmap") {
				//skip appid and roleid - no need to update roleid and appid
			}
			else if (typeof (req.body[key]) == "boolean") {
				qparam += key + " = " + req.body[key] + ",";
			}
			else if (typeof (req.body[key]) == "object") {
				qparam += key + " = '" + JSON.stringify(req.body[key]) + "',";
			}
			else if (typeof (req.body[key]) == "string") {
				qparam += key + " = '" + req.body[key] + "',";
			}
		}
		// Add mofify by & modify time in query
		qparam += "mod_ts = '" + moment.utc() + "', mod_by = '" + req.authorization.emailid + "',";
		var query = "update tbl_deviceinfo set " + qparam.slice(0, -1) + " where devicedbid=" + devicedbid + " and deviceid = '" + deviceid + "'";
		//Update Data
		client.execute(query, function (err, result) {
			if (err) {
				// Return error message in response if error is occured during database operation.
				returnmsg = response.errorresponse(err.message.replace(/"/g, " "));
				res.status(500).send(returnmsg);
			}
			else {
				//Return success message if Role is updated successfully
				returnmsg = response.successresponse(error.success, null);
				res.status(200).send(returnmsg);
			}
		});
	}
	//For creation of data table based upon the data and type recieved
	function createdatatable(req, res) {
		return new promise(function (resolve, reject) {
			type = req.body.type;
			data = JSON.stringify(req.body.data);
			if (type != null && data != null) {
				var datajson = JSON.parse(data);
				var propertiesList = datajson.properties;
				var columndata = "";
				var booleancolumnslist = config.booleancolumns.split("#");
				var numbercolumnslist = config.numbercolumns.split("#");
				var integercolumnslist = config.integercolumns.split("#");
				for (var i = 0, len = propertiesList.length; i < len; i++) {
					var propmap = propertiesList[i];
					Object.keys(propertiesList[i]).forEach(function (key) {
						if (propertiesList[i][key].type != null) {
							if (booleancolumnslist.includes(propertiesList[i][key].type)) {
								columndata = columndata + key + " boolean,"
							} else if (integercolumnslist.includes(propertiesList[i][key].type)) {
								columndata = columndata + key + " int,"
							} else if (numbercolumnslist.includes(propertiesList[i][key].type)) {
								columndata = columndata + key + " double,"
							} else {
								columndata = columndata + key + " varchar,"
							}
						} else {
							columndata = columndata + key + " varchar,"
						}
					});
				}
				if (columndata != "") {
					columndata = columndata.slice(0, -1);
					// Create table query based upon the column data
					var query = "CREATE TABLE " + config.datatablenameprefix + type.toLowerCase() + " (devdatadbid uuid PRIMARY KEY,create_ts timestamp,created_by varchar, " + columndata + ")";
					// Execute query in cassandra
					client.execute(query, "", { prepare: true }, function (err) {
						if (!err) {
							// Return success message in response
							returnmsg = response.errorresponse(error.success, null);
							resolve(returnmsg);
							//
						} else {
							// Error message in response if error is occurred duringdatabase operation.
							returnmsg = response.errorresponse(err);
							res.status(500).send(returnmsg);
						}
					});
				}
			}
		});
	}
	function alterdatatable(req, res) {
		return new promise(function (resolve, reject) {
			var type = req.body.type;
			var columnsmap = JSON.stringify(req.body.columnsmap);
			var columndata = "";
			if (type != null && columnsmap != null) {
				type = type.toLowerCase();
				var columnsmapjson = JSON.parse(columnsmap);
				var existingcolarray = [];
				var query = "select * from " + config.datatablenameprefix + type.toLowerCase() + " LIMIT 1";
				client.execute(query, function (err, result) {
					if (!err) {
						for (var i = 0, len = result.columns.length; i < len; i++) {
							existingcolarray[i] = result.columns[i].name;
						}
						processresults(columnsmapjson, existingcolarray, columndata).then(function (columndata, returnmsg) {
							if (columndata != "") {
								columndata = columndata.slice(0, -1);
								// Alter the existing data table
								var query = "ALTER TABLE " + config.datatablenameprefix + type.toLowerCase() + " ADD (" + columndata + ")";
								// Execute query in cassandra
								client.execute(query, "", { prepare: true }, function (err) {
									if (!err) {
										// Return success message in response
										returnmsg = response.successresponse(error.success, null);
										resolve(returnmsg);
									} else {
										// Error message in response if error is occurred during database operation.
										returnmsg = response.errorresponse(err);
										res.status(500).send(returnmsg);
									}
								});
							}
							else {
								returnmsg = response.successresponse(error.success, null);
								resolve(returnmsg);
							}
						});
					} else {
						// Error message in response if error is occurred during database operation.
						returnmsg = response.errorresponse(err);
						res.status(500).send(returnmsg);
					}
				});
			}
			else {
				returnmsg = "";
				resolve(returnmsg);
			}
		});
	}
	// For fetching the device data and processing the device data results
	function processresults(columnsmapjson, existingcolarray, columndata) {
		return new promise(function (resolve, reject) {
			var booleancolumnslist = config.booleancolumns.split("#");
			var numbercolumnslist = config.numbercolumns.split("#");
			var integercolumnslist = config.integercolumns.split("#");
			var errorindex = 0;
			var len = Object.keys(columnsmapjson).length;
			var count = 1;
			Object.keys(columnsmapjson).forEach(function (key) {
				if (key != null) {
					key = key.toLowerCase();
					if (!existingcolarray.includes(key)) {
						if (booleancolumnslist.includes(columnsmapjson[key])) {
							columndata = columndata + key + " boolean,"
						} else if (integercolumnslist.includes(columnsmapjson[key])) {
							columndata = columndata + key + " int,"
						} else if (numbercolumnslist.includes(columnsmapjson[key])) {
							columndata = columndata + key + " double,"
						} else {
							columndata = columndata + key + " varchar,"
						}
					} else {
						errorindex++;
						returnmsg = response.errorresponse(error.existedcolumn + key);
						columndata = "";
						resolve(columndata);
						resolve(returnmsg);
					}
				}
				if ((errorindex == 0) && (count == len)) {
					returnmsg = "";
					resolve(columndata);
					resolve(returnmsg);
				}
				count++;
			});
		});
	}
	// End point for fetching the registered device information
	app.get('/registration/device', function (req, res) {
		var dev_id = req.query["dev_id"];
		var filter_start_date = req.query["filter_start_date"];
		var filter_end_date = req.query["filter_end_date"];
		var filter_limit = req.query['filter_limit'];
		var secret = config.secretkey;

		var query = "SELECT  * FROM tbl_deviceinfo where ";
		var isFiltered = 0;
		if (filter_start_date != null) {
			isFiltered = 1;
			if (filter_end_date != null) {

				query = query + " create_ts >= '" + filter_start_date
					+ "' AND create_ts <= '" + filter_end_date + "'";
			} else {
				var d1 = new Date();
				query = query + " create_ts >= '" + filter_start_date + "'";
			}
			if (dev_id != null) {
				query = query + " AND deviceid IN ('" + dev_id.replace(",", "','") + "') ";
			}

		} else if (filter_end_date != null) {
			isFiltered = 1;
			var d1 = new Date();
			query = query + " create_ts <= '" + filter_end_date + "'";

			if (dev_id != null) {
				query = query + " AND deviceid IN ('" + dev_id.replace(",", "','") + "') ";
			}

		} else if (dev_id != null) {
			isFiltered = 1;
			query = query + " deviceid IN ('" + dev_id.replace(",", "','") + "') ";

		}

		if (filter_limit != null) {
			if (isFiltered == 0) {
				isFiltered = 1;
				query = " SELECT  * FROM tbl_deviceinfo LIMIT " + filter_limit;
			} else {
				isFiltered = 1;
				query = query + " LIMIT " + filter_limit;
			}
		}

		if (isFiltered == 0) {
			isFiltered = 1;
			query = "SELECT  * FROM tbl_deviceinfo ";
		} else {
			query = query + " ALLOW FILTERING";
		}
		// Execute query in cassandra using its client object
		client.execute(query, function (err, result) {
			if (!err) {
				returnmsg = response.successresponse(error.success, result.rows);
				res.status(200).send(returnmsg);
			} else {
				// Error message in response if error is occurred during
				// during database operation.
				returnmsg = response.errorresponse(err);
				res.status(500).send(returnmsg);
			}
		})

	});
}