module.exports = function (app, bodyParser, client, config, jwt, error, response) {
    /* Exclude below APIS's from middleware */
    var options = { "exclude": ['/favicon.ico']};
    var secretkey = "", returnmsg = "";
    /* middleware check content-type = 'application/json' set or not */
    var contenttypecheck = function (req, res, next) {
        if (req.method != "GET") {
            req.check({
                'content-type': {
                    in: 'headers',
                    notEmpty: {
                        errorMessage: 'content-type not defined'
                    },
                    matches: {
                        options: [/\b(?:application\/json)\b/],
                        errorMessage: "invalid content-type"
                    }
                }
            })
            req.getValidationResult().then(function (result) {
                var errors = result.useFirstErrorOnly().array();
                if (errors.length > 0) {
                    returnmsg = response.errorresponse(errors);
                    res.status(400).send(JSON.stringify(returnmsg));
                }
                else {
                    next();
                }
            })
        }
        else {
            next();
        }
    }
    /* middleware authenticate API's have token or not and if available then token is valid or not */
    var tokenauth = function (options) {
        return function (req, res, next) {
            if (options.exclude.indexOf(req.path) == -1) {
                var token = req.headers[config.authtoken];
                secretkey = config.secretkey;
                if (token) {
                    jwt.verify(token, secretkey, function (err, data) {
                        if (err) {
                            returnmsg = response.errorresponse(err);
                            res.status(400).send(returnmsg);
                        } else {
                            req.authorization = data;
                            next();
                        }
                    });
                }
                else {
                    returnmsg = response.errorresponse(error.tokennotavailable);
                    res.status(400).send(returnmsg);
                }
            }
            else {
                next();
            }
        }
    }
    /* middleware for wrirting log */
    var logmanage = function (req, res, next) {
        next();
    }
    /* middleware's */
    app.use(contenttypecheck);
    app.use(tokenauth(options));
    app.use(logmanage);
}