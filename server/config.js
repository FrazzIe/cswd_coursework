const dotenv = require('dotenv').config(); //load .env file into process.env.*

if (dotenv.error) { //throw an error if the environment vars failed to load
	throw dotenv.error
}

const config = {
	mysql: {
		connectionLimit: 10,
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASS,
		database: process.env.MYSQL_DB,
	},
	jwt: {
		secret: process.env.JWT_SECRET
	},
}

module.exports = config;