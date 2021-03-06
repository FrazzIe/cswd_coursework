const mysql = require("mysql");
const config = require("../config"); //import dependencies

var pool = mysql.createPool(config.mysql); //create connection pool
var queries = { //list of mysql queries
	getUser: "SELECT users.id, users.username, users.password, groups.name AS 'group' FROM users JOIN groups ON (users.group_id = groups.id) WHERE users.username = ?",
	getUserById: "SELECT users.id, users.username, groups.name AS 'group' FROM users JOIN groups ON (users.group_id = groups.id) WHERE users.id = ?",
	getBooks: "SELECT books.id, books.isbn, books.title, books.description, books.year, books.category, GROUP_CONCAT(book_authors.author SEPARATOR ', ') AS 'authors' FROM books JOIN book_authors ON (book_authors.book_id = books.id) GROUP BY books.id ORDER BY books.id DESC",
	getRecentBooks: "SELECT books.id, books.isbn, books.title, books.description, books.year, books.category, GROUP_CONCAT(book_authors.author SEPARATOR ', ') AS 'authors' FROM books JOIN book_authors ON (book_authors.book_id = books.id) GROUP BY books.id ORDER BY books.id DESC LIMIT 8",
	getRandomBooks: "SELECT books.isbn, books.title, books.description, books.year, books.category, GROUP_CONCAT(book_authors.author SEPARATOR ', ') AS 'authors' FROM books JOIN book_authors ON (book_authors.book_id = books.id) GROUP BY books.id ORDER BY RAND() LIMIT 8",
	getRecommendedBooks: "SELECT books.isbn, books.title, books.description, books.year, books.category, GROUP_CONCAT(book_authors.author SEPARATOR ', ') AS 'authors' FROM books JOIN book_authors ON (book_authors.book_id = books.id) WHERE books.category IN (SELECT DISTINCT books.category FROM book_interests JOIN books ON (book_interests.book_id = books.id) WHERE book_interests.user_id = ? UNION SELECT DISTINCT books.category FROM book_history JOIN books ON (book_history.book_id = books.id) WHERE book_history.user_id = ?) AND books.id NOT IN (SELECT book_history.book_id FROM book_history WHERE book_history.user_id = ?) GROUP BY books.id LIMIT 4",
	getHighestRatedBooks: "SELECT books.isbn, books.title, books.description, books.year, books.category, GROUP_CONCAT(book_authors.author SEPARATOR ', ') AS 'authors', IFNULL((SELECT AVG(book_reviews.rating) FROM book_reviews WHERE book_reviews.book_id = books.id), 0) AS 'rating' FROM books JOIN book_authors ON (book_authors.book_id = books.id) GROUP BY books.id ORDER BY rating LIMIT 8",
	getBookByISBN: "SELECT books.id, books.isbn, books.title, books.description, books.year, books.category, GROUP_CONCAT(book_authors.author SEPARATOR ', ') AS 'authors', IFNULL((SELECT AVG(book_reviews.rating) FROM book_reviews WHERE book_reviews.book_id = books.id), 0) AS 'rating', IFNULL((SELECT 1 FROM book_history WHERE book_history.book_id = books.id AND book_history.user_id = ?), 0) AS 'read', IFNULL((SELECT 1 FROM book_reviews WHERE book_reviews.book_id = books.id AND book_reviews.creator_id = ? LIMIT 1), 0) AS 'reviewed' FROM books JOIN book_authors ON (book_authors.book_id = books.id) WHERE books.isbn = ? GROUP BY books.id",
	getBookReviewsById: "SELECT book_reviews.review, book_reviews.rating, users.username, groups.name AS 'group', UNIX_TIMESTAMP(book_reviews.created_at) AS 'created_at' FROM book_reviews JOIN users ON (book_reviews.creator_id = users.id) JOIN groups ON (users.group_id = groups.id) WHERE book_reviews.book_id = ?",
	getBookHistory: "SELECT books.isbn, books.title, books.description, books.year, books.category, GROUP_CONCAT(book_authors.author SEPARATOR ', ') AS 'authors', book_reviews.review, book_reviews.rating, UNIX_TIMESTAMP(book_reviews.created_at) AS 'review_created' FROM book_history JOIN books ON (books.id = book_history.book_id) JOIN book_authors ON (book_authors.book_id = books.id) JOIN book_reviews ON (book_reviews.book_id = books.id) WHERE book_history.user_id = ? GROUP BY books.id",
	getBookRatingDistribution: "SELECT book_reviews.rating, COUNT(book_reviews.rating) AS 'count' FROM book_reviews WHERE book_reviews.book_id = ? GROUP BY book_reviews.rating",
	getUserInterests: "SELECT books.category, IFNULL((SELECT 1 FROM book_interests JOIN books books1 ON (books1.id = book_interests.book_id) WHERE books1.category = books.category), 0) AS 'interest' FROM books WHERE books.category IN(SELECT DISTINCT books.category FROM book_interests JOIN books ON (book_interests.book_id = books.id) WHERE book_interests.user_id = ? UNION SELECT DISTINCT books.category FROM book_history JOIN books ON (book_history.book_id = books.id) WHERE book_history.user_id = ?) GROUP BY books.category",
	getUnselectedInterests: "SELECT books.category FROM books WHERE books.category NOT IN(SELECT DISTINCT books.category FROM book_interests JOIN books ON (book_interests.book_id = books.id) WHERE book_interests.user_id = ? UNION SELECT DISTINCT books.category FROM book_history JOIN books ON (book_history.book_id = books.id) WHERE book_history.user_id = ?) GROUP BY books.category",
	findBooks: "SELECT books.isbn, books.title, books.description, books.year, books.category, GROUP_CONCAT(book_authors.author SEPARATOR ', ') AS 'authors' FROM books JOIN book_authors ON (book_authors.book_id = books.id) WHERE books.isbn LIKE ? OR books.title LIKE ? OR books.category LIKE ? OR book_authors.author LIKE ? GROUP BY books.id",
	createUser: "INSERT INTO users (`username`, `password`, `group_id`) VALUES (?, ?, 1)",
	createInterest: "INSERT INTO book_interests (`book_id`, `user_id`) VALUES (?, ?)",
	createReview: "INSERT INTO book_reviews (`book_id`, `creator_id`, `review`, `rating`) VALUES (?, ?, ?, ?)",
	markBookRead: "INSERT INTO book_history (`book_id`, `user_id`) VALUES (?, ?)",
	checkAvailableInterest: "SELECT books.id, books.category FROM books WHERE books.category NOT IN(SELECT DISTINCT books.category FROM book_interests JOIN books ON (book_interests.book_id = books.id) WHERE book_interests.user_id = ? UNION SELECT DISTINCT books.category FROM book_history JOIN books ON (book_history.book_id = books.id) WHERE book_history.user_id = ?) AND books.category = ? GROUP BY books.category",
	removeInterest: "DELETE book_interests FROM book_interests JOIN books ON (books.id = book_interests.book_id) WHERE books.category = ? AND book_interests.user_id = ?",
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