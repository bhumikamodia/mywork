module.exports = function (mergeJSON, error) {
	validationcheck = function (url, method) {
		var schema = "", schema1 = "", schema2 = "";
		if ((url == "/registration/device") && (method == "POST" || method == "PUT")) {
			if (method == "POST") {
				schema1 = {
					'deviceid': {
						isstring: {
							errorMessage: error.notstring
						},
						isempty: {
							errorMessage: error.emptydeviceid
						}
					},
					'category': {
						isstring: {
							errorMessage: error.notstring
						},
						isempty: {
							errorMessage: error.emptydeviceid
						}
					},
					'data': {
						isobject: {
							errorMessage: error.notobject
						},
						isemptyobject: {
							errorMessage: error.emptyobject
						}
					}
				}
			} else {
				schema1 = {
					'x-deviceid': {
						in: 'headers',
						isstring: {
							errorMessage: error.notstring
						},
						isempty: {
							errorMessage: error.emptydeviceid
						}
					},
					'x-devicedbid': {
						in: 'headers',
						isstring: {
							errorMessage: error.notstring
						},
						isempty: {
							errorMessage: error.emptydeviceid
						},
						isUUID: {
							errorMessage: error.invaliddeviceid
						}
					},
					'category': {
						optional: true,
						isstring: {
							errorMessage: error.notstring
						},
						isempty: {
							errorMessage: error.emptydeviceid
						}
					},
					'data': {
						optional: true,
						isobject: {
							errorMessage: error.notobject
						},
						isemptyobject: {
							errorMessage: error.emptyobject
						}
					}
				}
			}
			schema2 = {
				'proto': {
					optional: true,
					isstring: {
						errorMessage: error.notstring
					}
				},
				'schematype': {
					optional: true,
					isstring: {
						errorMessage: error.notstring
					}
				},
				'type': {
					optional: true,
					isstring: {
						errorMessage: error.notstring
					}
				}
			}
			schema = mergeJSON.merge(schema1, schema2);
		}
		return schema;
	}
	return this;
}