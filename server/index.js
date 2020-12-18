const config = require("./config");
const mysql = require("./models/mysql");
const express = require("express");
const passport = require("passport");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const auth = require("./models/auth")(config.jwt.secret, mysql, passport, argon2);
const permission = require("./models/permissions");
const app = express();

app.use(express.json());
app.use(passport.initialize());

function usernameCheck(input) {
	const pattern = /^(?=.{1,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
	return pattern.test(input) || "Invalid username";
};

function passwordCheck(input) {
	const uppercase = /(?=.*?[A-Z])/;
	const lowercase = /(?=.*?[a-z])/;
	const number = /(?=.*?[0-9])/;
	const special = /(?=.*?[#?!@$%^&*-])/;

	if (!uppercase.test(input))
		return "Password must contain at least one uppercase letter";
	if (!lowercase.test(input))
		return "Password must contain at least one lowercase letter";
	if (!number.test(input))
		return "Password must contain at least one number";
	if (!special.test(input))
		return "Password must contain at least one special character";

	return true;
};

app.post("/auth/login", (req, res) => { //When /login is requested by a user
	passport.authenticate("local", { session: false }, (err, user, info) => { // models/auth.js -> use strategy to validate user login credentials
		if (err) //if there is an error then
			return res.status(500).json({ error: err });

		if (!user) //if the profile does not exist then
			return res.status(403).json({ error: info.message }); //refuse login

		const token = jwt.sign(user.id, config.jwt.secret);
		return res.status(200).json({ token: token });
	})(req, res);
});

app.get("/auth/user", (req, res) => {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) //if there is an error then
			return res.status(500).json({ error: err.message });

		if (!user)
			return res.status(403).json({ error: info.message });

		res.status(200).json({ user: user });
	})(req, res);
});

app.post("/auth/register", function(req, res) {
	if (!(req.body && req.body.data))
		return res.status(500).json({ error: "Invalid parameters" });

	if (!(req.body.data.username && req.body.data.password))
		return res.status(500).json({ error: "You must include a username and a password" });
	
	if (req.body.data.username.length > 30)
		return res.status(200).json({ error: "Username must be less than 30 characters" });

	isNameValid = usernameCheck(req.body.data.username);
	isPasswordValid = passwordCheck(req.body.data.password);

	if (typeof isNameValid == "string")
		return res.status(200).json({ error: isNameValid });

	if (typeof isPasswordValid == "string")
		return res.status(200).json({ error: isPasswordValid });

	mysql.query(mysql.queries.getUser, [req.body.data.username]).then((result) => { //finds any rows with the username
		if (typeof result[0] === "undefined") { //checks if a user does not exist
			argon2.hash(req.body.data.password).then((hashedPassword) => { //scrambles the password using argon2
				mysql.query(mysql.queries.createUser, [req.body.data.username, hashedPassword]).then((result) => { //creates user account in database
					res.status(200).json({});
				}).catch((error) => {
					res.status(500).json({ error: error.message });
					console.log(error.message);
				});
			}).catch((error) => {
				res.status(500).json({ error: error.message });
			});
		} else { //prevents registration as user already exists
			res.status(403).json({ error: "A user already exists with this username" });
		}
	}).catch((error) => {
		console.log(error.message);
		res.status(500).json({ error: error.message });
	});
});

app.post("/auth/logout", function(req, res) {
	req.logout();
	res.status(200).json({});
});

app.get("/books", function(req, res) {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) //if there is an error then
			return res.status(500).json({ error: err.message });

		mysql.query(mysql.queries.getRecentBooks, []).then((recentBooks) => {
			mysql.query(mysql.queries.getHighestRatedBooks, []).then((ratedBooks) => {
				mysql.query(mysql.queries.getRandomBooks, []).then((randomBooks) => {
					if (!user)
						return res.status(200).json([
							{ title: "Recommended", data: [] },
							{ title: "Recently Added", data: recentBooks },
							{ title: "Highest Rated", data: ratedBooks },
							{ title: "Random", data: randomBooks },
						]);
					else
						mysql.query(mysql.queries.getRecommendedBooks, [user.id, user.id, user.id]).then((recommendedBooks) => {
							return res.status(200).json([
								{ title: "Recommended", data: recommendedBooks },
								{ title: "Recently Added", data: recentBooks },
								{ title: "Highest Rated", data: ratedBooks },
								{ title: "Random", data: randomBooks },
							]);
						}).catch((error) => {
							console.log(error.message);
							res.status(500).json({ error: error.message });
						});
				}).catch((error) => {
					console.log(error.message);
					res.status(500).json({ error: error.message });
				});
			}).catch((error) => {
				console.log(error.message);
				res.status(500).json({ error: error.message });
			});
		}).catch((error) => {
			console.log(error.message);
			res.status(500).json({ error: error.message });
		});
	})(req, res);
});

app.get("/search/:value", function(req, res) {
	if (!req.params.value) //check if param exists
		return res.status(500).json({ error: "Invalid search value" });
	if (req.params.value.length < 4)
		return res.status(200).json({ error: "Search value must be at least 4 characters" });

	req.params.value = `%${req.params.value}%`;

	mysql.query(mysql.queries.findBooks, [req.params.value, req.params.value, req.params.value, req.params.value]).then((searchResults) => {
		return res.status(200).json(searchResults);
	}).catch((error) => {
		console.log(error.message);
		res.status(500).json({ error: error.message });
	});
});

module.exports = {
	path: "/api",
	handler: app
};