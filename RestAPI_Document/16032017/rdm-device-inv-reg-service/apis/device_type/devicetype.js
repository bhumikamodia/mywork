/*
File :- devicetype.js
Description :- This file is responsible for sending the device type information to the requesting client.
Created Date :- 14-03-2017
Modify Date :- 14-03-2017
*/
module.exports = function(app, client, config, error, jwt,response) {
	var token;
	var secret = config.secretkey;
	var returnmsg = "";
	var devicetype;
	var filter_start_date;
	var filter_end_date;
	var filter_limit;
	// End point for fetching the device types information
	app.get('/registration/devicetype', function(req, res) {
		devicetype = req.query["devicetype"];
		filter_start_date = req.query["filter_start_date"];
		filter_end_date = req.query["filter_end_date"];
		filter_limit = req.query['filter_limit'];
		var query = "SELECT * FROM tbl_device_type where ";
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

			if (devicetype != null) {
				query = query + " AND devicetype IN ('" + devicetype.replace(",","','")+ "') " ;
			}
			
		} else if (filter_end_date != null) {
			isFiltered = 1;
			var d1 = new Date();
			query = query + " create_ts <= '" + filter_end_date + "'";
			
			if (devicetype != null) {
				query = query + " AND devicetype IN ('" + devicetype.replace(",","','")+ "') " ;
			}
			
		} else if (devicetype != null) {
			isFiltered = 1;
			query = query + " devicetype IN ('" + devicetype.replace(",","','")+ "') " ;
		}
		if (filter_limit != null) {
			
			if (isFiltered == 0) {
				isFiltered = 1;
				query = " SELECT * FROM tbl_device_type LIMIT " + filter_limit;
			} else {
				isFiltered = 1;
				query = query + " LIMIT " + filter_limit;
			}
		}
		
		if (isFiltered == 0) {
			isFiltered = 1;
			query = "SELECT * FROM tbl_device_type";
		} else {
			query = query + " ALLOW FILTERING";
		}
		// Execute query in cassandra using its client object
		client.execute(query, function(err, result) {
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