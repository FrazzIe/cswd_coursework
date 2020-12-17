var LocalStrategy = require("passport-local").Strategy;
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;

function getUserObject(data) {
	return {
		id: data.id,
		name: data.username,
		scope: data.group,
	}
}

module.exports = function(jwtSecret, mysql, passport, argon2) {
	// Configure the local strategy for use by Passport.
	//
	// The local strategy require a `verify` function which receives the credentials
	// (`username` and `password`) submitted by the user.  The function must verify
	// that the password is correct and then invoke `cb` with a user object, which
	// will be set at `req.user` in route handlers after authentication.
	passport.use(new LocalStrategy(function(username, password, cb) {
		mysql.query(mysql.queries.getUser, [username]).then((result) => { //find user
			if (typeof result[0] !== "undefined") { //found user
				argon2.verify(result[0].password, password).then((matches) => {
					if (matches) { //password matches
						cb(null, getUserObject(result[0]), "ok");
					} else { //doesn't match
						cb(null, false, {
							message: "You have entered an incorrect password!"
						});
					}
				}).catch((error) => {
					cb(error);
				})
			} else { //not found user
				cb(null, false, {
					message: "This user does not exist!"
				});
			}
		}).catch((error) => {
			cb(error);
		});
	}));

	jwtOptions = {};
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	jwtOptions.secretOrKey = jwtSecret;

	passport.use(new JwtStrategy(jwtOptions, function(payload, cb) {
		mysql.query(mysql.queries.getUserById, [payload]).then((result) => { //find user
			if (typeof result[0] !== "undefined") //found user
				return cb(null, getUserObject(result[0]));

			return cb(null, false, {
				message: "Invalid token!"
			});
		}).catch((error) => {
			return cb(error);
		});
	}));
};