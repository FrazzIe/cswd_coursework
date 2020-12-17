const mysql = require("mysql");
const config = require("../config"); //import dependencies

var pool = mysql.createPool(config.mysql); //create connection pool
var queries = { //list of mysql queries
	getUser: "SELECT users.id, users.username, users.password, groups.name AS 'group' FROM users JOIN groups ON (users.group_id = groups.id) WHERE users.username = ?",
	getUserById: "SELECT users.id, users.username, groups.name AS 'group' FROM users JOIN groups ON (users.group_id = groups.id) WHERE users.id = ?",
	getRecentBooks: "SELECT books.isbn, books.title, books.description, books.year, books.category FROM books ORDER BY books.id DESC LIMIT 10",
	getRandomBooks: "SELECT books.isbn, books.title, books.description, books.year, books.category FROM books ORDER BY RAND() LIMIT 10",
	getRecommendedBooks: "SELECT books.isbn, books.title, books.description, books.year, books.category FROM books WHERE books.category IN (SELECT DISTINCT books.category FROM book_interests JOIN books ON (book_interests.book_id = books.id) WHERE book_interests.user_id = ? UNION SELECT DISTINCT books.category FROM book_history JOIN books ON (book_history.book_id = books.id) WHERE book_history.user_id = ?) AND books.id NOT IN (SELECT book_history.book_id FROM book_history WHERE book_history.user_id = ?) LIMIT 10",
	getHighestRatedBooks: "SELECT books.isbn, books.title, books.description, books.year, books.category, IFNULL((SELECT AVG(book_reviews.rating) FROM book_reviews WHERE book_reviews.book_id = books.id), 0) AS 'rating' FROM books ORDER BY rating LIMIT 10",
	createUser: "INSERT INTO users (`username`, `password`, `group_id`) VALUES (?, ?, 1)",
}

function execute(sql, params) { //asynchronous sql execute function
	return new Promise((resolve, reject) => { //create a new promise
		pool.query(sql, params, (error, result, fields) => { //query the server
		 if (error) reject(error); //if error then display error
			resolve(result); //return result
		});
	});
};

execute("SELECT VERSION()", {}).then((result) => { //Check if connection was successful
	console.log("Database: connection established!");
}).catch((error) => {
	console.log("Database: " + error.message);
});

module.exports = {
	queries: queries,
	query: execute
};