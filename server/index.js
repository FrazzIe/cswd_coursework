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

app.get("/books/all", function(req, res) {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) //if there is an error then
			return res.status(500).json({ error: err.message });

		mysql.query(mysql.queries.getBooks, []).then((books) => {
			return res.status(200).json(books);
		}).catch((error) => {
			console.log(error.message);
			res.status(500).json({ error: error.message });
		});
	})(req, res);
});

app.get("/search/:value", function(req, res) {
	if (!req.params.value) //check if param exists
		return res.status(500).json({ error: "Invalid search value" });

	req.params.value = `%${req.params.value}%`;

	mysql.query(mysql.queries.findBooks, [req.params.value, req.params.value, req.params.value, req.params.value]).then((searchResults) => {
		return res.status(200).json(searchResults);
	}).catch((error) => {
		res.status(500).json({ error: error.message });
	});
});

app.get("/books/isbn/:id", function(req, res) {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) //if there is an error then
			return res.status(500).json({ error: err.message });

		if (!req.params.id) //check if param exists
			return res.status(500).json({ error: "Invalid book id" });
		else if (isNaN(req.params.id)) //check if param is not a number
			return res.status(500).json({ error: "Invalid book id" });

		let userId = user ? user.id : 0;

		mysql.query(mysql.queries.getBookByISBN, [userId, userId, req.params.id]).then((book) => {
			if (typeof book[0] === "undefined")
				res.status(404).json({ error: "This book no longer exists" });
			else
				mysql.query(mysql.queries.getBookReviewsById, [book[0].id]).then((reviews) => {
					book[0].reviews = reviews;
					
					mysql.query(mysql.queries.getBookRatingDistribution, [book[0].id]).then((ratings) => {
						book[0].ratings = ratings;
						console.log(book[0]);
						res.status(200).json(book[0]);
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

app.post("/books/read/:id", function(req, res) {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) //if there is an error then
			return res.status(500).json({ error: err.message });

		if (!user)
			return res.status(403).json({ error: info.message });
		
		if (!req.params.id) //check if param exists
			return res.status(404).json({ error: "Invalid book id" });
		else if (isNaN(req.params.id)) //check if param is not a number
			return res.status(404).json({ error: "Invalid book id" });

		mysql.query(mysql.queries.getBookByISBN, [user.id, user.id, req.params.id]).then((book) => {
			if (typeof book[0] === "undefined")
				res.status(404).json({ error: "This book no longer exists" });
			else if (book[0].read == 1)
				res.status(200).json({ error: "You already marked this book as read" });
			else
				mysql.query(mysql.queries.markBookRead, [book[0].id, user.id]).then((result) => {
					res.status(200).json({ id: req.params.id });
				}).catch((error) => {
					res.status(500).json({ error: "Something went wrong" });
				});
		}).catch((error) => {
			res.status(500).json({ error: "Something went wrong" });
		});
	})(req, res);
});

app.post("/books/review/:id", function(req, res) {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) //if there is an error then
			return res.status(500).json({ error: err.message });

		if (!user)
			return res.status(403).json({ error: info.message });

		if (!(req.body && req.body.data && req.body.data.review && req.body.data.rating && !isNaN(req.body.data.rating)))
			return res.status(500).json({ error: "Invalid parameters" });

		if (req.body.data.review.length < 20 || req.body.data.review.length > 2000)
			return res.status(200).json({ error: "The review must be between 20 and 2000 characters long" });

		if (req.body.data.rating < 1 && req.body.data.rating > 5)
			return res.status(200).json({ error: "The rating must be between 1 and 5 stars" });

		if (!req.params.id) //check if param exists
			return res.status(404).json({ error: "Invalid book id" });
		else if (isNaN(req.params.id)) //check if param is not a number
			return res.status(404).json({ error: "Invalid book id" });

		mysql.query(mysql.queries.getBookByISBN, [user.id, user.id, req.params.id]).then((book) => {
			if (typeof book[0] === "undefined")
				res.status(404).json({ error: "This book no longer exists" });
			else if (book[0].read == 0)
				res.status(200).json({ error: "You cannot review a book you haven't read" });
			else if (book[0].reviewed == 1)
				res.status(200).json({ error: "You cannot review a book you have already reviewed" });
			else
				mysql.query(mysql.queries.createReview, [book[0].id, user.id, req.body.data.review, req.body.data.rating]).then((review) => {
					res.status(200).json({ id: req.params.id });
				}).catch((error) => {
					res.status(500).json({ error: "Something went wrong" });
				});
		}).catch((error) => {
			res.status(500).json({ error: "Something went wrong" });
		});
	})(req, res);
});

app.get("/books/history", function(req, res) {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) //if there is an error then
			return res.status(500).json({ error: err.message });

		if (!user)
			return res.status(403).json({ error: info.message });

		mysql.query(mysql.queries.getBookHistory, [user.id]).then((history) => {
			res.status(200).json(history);
		}).catch((error) => {
			res.status(500).json({ error: "Something went wrong" });
		});		
	})(req, res);
});

app.get("/books/interests", function(req, res) {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) //if there is an error then
			return res.status(500).json({ error: err.message });

		if (!user)
			return res.status(403).json({ error: info.message });

		mysql.query(mysql.queries.getUserInterests, [user.id, user.id]).then((interests) => {
			mysql.query(mysql.queries.getUnselectedInterests, [user.id, user.id]).then((availableInterests) => {
				res.status(200).json({
					available: availableInterests,
					current: interests,
				});
			}).catch((error) => {
				console.log(error);
				res.status(500).json({ error: "Something went wrong" });
			});	
		}).catch((error) => {
			res.status(500).json({ error: "Something went wrong" });
		});		
	})(req, res);
});

app.post("/books/interest/add", function(req, res) {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) //if there is an error then
			return res.status(500).json({ error: err.message });

		if (!user)
			return res.status(403).json({ error: info.message });

		if (!(req.body && req.body.data && req.body.data.interest))
			return res.status(500).json({ error: "Invalid parameters" });

		mysql.query(mysql.queries.checkAvailableInterest, [user.id, user.id, req.body.data.interest]).then((interest) => {
			if (typeof interest[0] === "undefined")
				res.status(404).json({ error: "You already have this interest" });
			else
				mysql.query(mysql.queries.createInterest, [interest[0].id, user.id]).then((result) => {
					res.status(200).json({ id: result.insertId });
				}).catch((error) => {
					res.status(500).json({ error: "Something went wrong" });
				});
		}).catch((error) => {
			console.log(error);
			res.status(500).json({ error: "Something went wrong" });
		});
	})(req, res);
});

app.post("/books/interest/remove", function(req, res) {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) //if there is an error then
			return res.status(500).json({ error: err.message });

		if (!user)
			return res.status(403).json({ error: info.message });

		if (!(req.body && req.body.data && req.body.data.interest))
			return res.status(500).json({ error: "Invalid parameters" });

		mysql.query(mysql.queries.checkAvailableInterest, [user.id, user.id, req.body.data.interest]).then((interest) => {
			if (typeof interest[0] === "undefined")
				mysql.query(mysql.queries.removeInterest, [req.body.data.interest, user.id]).then((result) => {
					res.status(200).json({});
				}).catch((error) => {
					res.status(500).json({ error: "Something went wrong" });
					console.log(error);
				});
			else
				res.status(404).json({ error: "You can't remove an interest you don't have" });
		}).catch((error) => {
			console.log(error);
			res.status(500).json({ error: "Something went wrong" });
		});
	})(req, res);
});

module.exports = {
	path: "/api",
	handler: app
};