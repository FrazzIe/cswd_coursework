/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE IF NOT EXISTS `book_catalog` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `book_catalog`;

CREATE TABLE IF NOT EXISTS `books` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `isbn` char(13) NOT NULL,
  `creator_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` varchar(150) NOT NULL,
  `description` mediumtext NOT NULL,
  `publisher` varchar(150) NOT NULL DEFAULT '',
  `year` year(4) NOT NULL,
  `category` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn` (`isbn`),
  KEY `users_books_fk` (`creator_id`),
  CONSTRAINT `users_books_fk` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COMMENT='Contains book data';

/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` (`id`, `isbn`, `creator_id`, `created_at`, `title`, `description`, `publisher`, `year`, `category`) VALUES
	(1, '9781491952023', 1, '2020-12-17 08:58:30', 'JavaScript: The Definitive Guide, 7th Edition', 'JavaScript is the programming language of the web and is used by more software developers today than any other programming language. For nearly 25 years this best seller has been the go-to guide for JavaScript programmers. The seventh edition is fully updated to cover the 2020 version of JavaScript, and new chapters cover classes, modules, iterators, generators, Promises, async/await, and metaprogramming. You\'ll find illuminating and engaging example code throughout. This book is for programmers who want to learn JavaScript and for web developers who want to take their understanding and mastery to the next level.', 'O\'Reilly', '2020', 'JavaScript'),
	(2, '9781838987572', 1, '2020-12-17 09:01:01', 'Node.js Web Development, 5th Edition', 'Build scalable web applications using Node.js, Express.js, and the latest ECMAScript techniques, along with deploying applications with AWS and Docker with this updated fifth edition.', 'Packt Publishing', '2020', 'Full-stack'),
	(3, '9781492051725', 1, '2020-12-17 09:09:57', 'Learning React: Modern Patterns for Developing React Apps', 'If you want to learn how to build efficient React applications, this is your book. Ideal for web developers and software engineers who understand how JavaScript, CSS, and HTML work in the browser, this updated edition provides best practices and patterns for writing modern React code. No prior knowledge of React or functional programming is necessary.', 'O\'Reilly', '2020', 'React'),
	(4, '9781839210662', 1, '2020-12-17 09:13:32', 'Learning Angular: A no-nonsense beginner\'s guide to building web applications with Angular 10 and TypeScript', 'Angular, loved by millions of web developers around the world, continues to be one of the top JavaScript frameworks thanks to its regular updates and new features that enable fast, cross-platform, and secure frontend web development. With Angular, you can achieve high performance using the latest web techniques and extensive integration with web tools and integrated development environments (IDEs). Updated to Angular 10, this third edition of the Learning Angular book covers new features and modern web development practices to address the current frontend web development landscape.', 'Packt Publishing', '2020', 'Angular'),
	(5, '9781789134520', 1, '2020-12-17 09:15:08', 'Hands-On Full-Stack Web Development with GraphQL and React', 'React, one of the most widely used JavaScript frameworks, allows developers to build fast and scalable front end applications for any use case. GraphQL is the modern way of querying an API. It represents an alternative to REST and is the next evolution in web development. Combining these two revolutionary technologies will give you a future-proof and scalable stack you can start building your business around.', 'Packt Publishing', '2020', 'Full-stack'),
	(6, '9781617294976', 1, '2020-12-17 09:16:25', 'Redux in Action', 'With Redux in Action, you\'ll discover how to integrate Redux into your React application and development environment, write custom middleware, and optimize for performance.', 'Manning', '2018', 'React'),
	(7, '9781491904244', 1, '2020-12-17 09:17:38', 'You Don\'t Know JS: ES6 & Beyond', 'No matter how much experience you have with JavaScript, odds are you don’t fully understand the language. As part of the You Don’t Know JS series, this compact guide focuses on new features available in ECMAScript 6 (ES6), the latest version of the standard upon which JavaScript is built.', 'O\'Reilly', '2016', 'JavaScript'),
	(8, '9781449371876', 1, '2020-12-17 09:19:39', 'Real-Time Communication with WebRTC: Peer-to-Peer in the Browser', 'Deliver rich audio and video real-time communication and peer-to-peer data exchange right in the browser, without the need for proprietary plug-ins. This concise hands-on guide shows you how to use the emerging Web Real-Time Communication (WebRTC) technology to build a browser-to-browser application, piece by piece.', 'O\'Reilly', '2014', 'Real-time'),
	(9, '9781449369279', 1, '2020-12-17 09:20:57', 'WebSocket', 'Until recently, creating desktop-like applications in the browser meant using inefficient Ajax or Comet technologies to communicate with the server. With this practical guide, you’ll learn how to use WebSocket, a protocol that enables the client and server to communicate with each other on a single connection simultaneously. No more asynchronous communication or long polling!.', 'O\'Reilly', '2015', 'Real-time'),
	(10, '9781484257371', 1, '2020-12-17 09:21:44', 'Modern Full-Stack Development: Using TypeScript, React, Node.js, Webpack, and Docker', 'React is one of the most popular web development tools available today, and Node.js is extremely popular for server-side development.  The fact that both utilize JavaScript is a big selling point, but as developers use the language more, they begin to recognize the shortcomings, and that’s where TypeScript comes in and why it’s gaining in popularity quickly.  Add Webpack and Docker to the mix, and you’ve got a potent full development stack on which to build applications.', 'Apress', '2020', 'Full-stack'),
	(11, '9781838641443', 1, '2020-12-17 09:22:58', 'Learn React Hooks: Build and refactor modern React.js applications using Hooks', 'React Hooks revolutionize how you manage state and effects in your web applications. They enable you to build simple and concise React.js applications, along with helping you avoid using wrapper components in your applications, making it easy to refactor code.', 'Packt Publishing', '2019', 'React'),
	(12, '9781119366447', 1, '2020-12-17 09:23:35', 'Professional JavaScript for Web Developers', 'Professional JavaScript for Web Developers is the essential guide to next-level JavaScript development. Written for intermediate-to-advanced programmers, this book jumps right into the technical details to help you clean up your code and become a more sophisticated JavaScript developer. From JavaScript-specific object-oriented programming and inheritance, to combining JavaScript with HTML and other markup languages, expert instruction walks you through the fundamentals and beyond.', 'Wrox', '2019', 'JavaScript'),
	(13, '9781492030713', 1, '2020-12-17 09:24:43', 'Learning GraphQL: Declarative Data Fetching for Modern Web Apps', 'GraphQL, a data query language that provides an alternative to REST and ad-hoc webservice architectures, is the most revolutionary technology for data fetching since Ajax. Just as React has changed the way web developers approach UI, GraphQL will change the way web developers work with data over HTTP.', 'O\'Reilly', '2018', 'Full-stack'),
	(14, '9781839215414', 1, '2020-12-17 09:25:13', 'Full-Stack React Projects: Learn MERN stack development by building modern web apps using MongoDB, Express, React, and Node.js', 'Facebook\'s React combined with industry-tested, server-side technologies, such as Node, Express, and MongoDB, enables you to develop and deploy robust real-world full-stack web apps. This updated second edition focuses on the latest versions and conventions of the technologies in this stack, along with their new features such as Hooks in React and async/await in JavaScript. The book also explores advanced topics such as implementing real-time bidding, a web-based classroom app, and data visualization in an expense tracking app.', 'Packt Publishing', '2020', 'Full-stack'),
	(15, '9781484257494', 1, '2020-12-17 09:26:05', 'Architecting CSS: The Programmer’s Guide to Effective Style Sheets', 'Leverage various CSS features in combination with popular architectures in order to bring your style sheets back under your control. While CSS is the primary technology used for building beautiful web user interfaces, the style sheet files themselves are often quite ugly; left chaotic and unstructured through lack of a consistent architectural approach. By addressing the structure of your style sheets in the same way that you do with code, see how it is possible to create style rules that are clean and easy to read. Dig deep into CSS fundamentals and learn how to use the available selectors to build powerful rules.', 'Apress', '2020', 'CSS'),
	(16, '9781492053118', 1, '2020-12-17 09:29:06', 'Web Application Security: Exploitation and Countermeasures for Modern Web Applications', 'While many resources for network and IT security are available, detailed knowledge regarding modern web application security has been lacking-until now. This practical guide provides both offensive and defensive security concepts that software engineers can easily learn and apply. Andrew Hoffman, a senior security engineer at Salesforce, introduces three pillars of web application security: recon, offense, and defense. You\'ll learn methods for effectively researching and analyzing modern web applications-including those you don\'t have direct access to. You\'ll also learn how to break into web applications using the latest hacking techniques. Finally, you\'ll learn how to develop mitigations for use in your own web applications to protect against hackers.', 'O\'Reilly', '2020', 'Security'),
	(17, '9781449393199', 1, '2020-12-17 09:29:52', 'CSS: The Definitive Guide: Visual Presentation for the Web', 'If you\'re a web designer or app developer interested in sophisticated page styling, improved accessibility, and saving time and effort, this book is for you. This revised edition provides a comprehensive guide to CSS implementation, along with a thorough review of the latest CSS specifications. CSS is a constantly evolving language for describing the presentation of web content on screen, printers, speech synthesizers, screen readers, and chat windows. It is used by all browsers on all screen sizes on all types of IoT devices, including phones, computers, video games, televisions, watches, kiosks, and auto consoles.', 'O\'Reilly', '2020', 'CSS'),
	(18, '9781484220498', 1, '2020-12-17 09:30:30', 'Advanced API Security: OAuth 2.0 and Beyond', 'Security must be an integral part of any development project. This book shares best practices in designing APIs for rock-solid security. API security has evolved since the first edition of this book, and the growth of standards has been exponential. OAuth 2.0 is the most widely adopted framework that is used as the foundation for standards, and this book shows you how to apply OAuth 2.0 to your own situation in order to secure and protect your enterprise APIs from exploitation and attack.', 'Apress', '2019', 'Security');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `book_authors` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `book_id` bigint(20) NOT NULL,
  `author` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `books_authors_fk` (`book_id`),
  CONSTRAINT `books_authors_fk` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COMMENT='Contains book authors';

/*!40000 ALTER TABLE `book_authors` DISABLE KEYS */;
INSERT INTO `book_authors` (`id`, `book_id`, `author`) VALUES
	(1, 1, 'David Flanagan'),
	(2, 2, 'David Herron'),
	(3, 3, 'Eve Porcello'),
	(4, 3, 'Alex Banks'),
	(5, 4, 'Aristeidis Bampakos'),
	(6, 4, 'Pablo Deeleman'),
	(7, 5, 'Sebastian Grebe'),
	(8, 6, 'Marc Garreau'),
	(9, 6, 'Will Faurot'),
	(10, 7, 'Kyle Simpson'),
	(11, 8, 'Salvatore Loreto'),
	(12, 8, 'Simon Pietro Romano'),
	(13, 9, 'Andrew Lombardi'),
	(14, 10, 'Frank Zammemetti'),
	(15, 11, 'Daniel Bugl'),
	(16, 12, 'Matt Frisbie'),
	(17, 13, 'Eve Porcello'),
	(18, 13, 'Alex Banks'),
	(19, 14, 'Shama Hoque'),
	(20, 15, 'Martine Dowden'),
	(21, 15, 'Michael Dowden'),
	(22, 16, 'Andrew Hoffman'),
	(23, 17, 'Eric Meyer'),
	(24, 17, 'Estelle Weyl'),
	(25, 18, 'Prabrath Siriwardena');
/*!40000 ALTER TABLE `book_authors` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `book_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `book_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `books_history_fk` (`book_id`),
  KEY `users_history_fk` (`user_id`),
  CONSTRAINT `books_history_fk` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `users_history_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COMMENT='Contains books read by users';

/*!40000 ALTER TABLE `book_history` DISABLE KEYS */;
INSERT INTO `book_history` (`id`, `book_id`, `user_id`, `created_at`) VALUES
	(1, 1, 2, '2020-12-19 00:50:02'),
	(2, 1, 3, '2020-12-19 00:50:02'),
	(3, 1, 4, '2020-12-19 00:50:02'),
	(4, 1, 5, '2020-12-19 00:50:02'),
	(5, 1, 6, '2020-12-19 00:50:02'),
	(6, 2, 8, '2020-12-19 00:50:02'),
	(7, 3, 8, '2020-12-19 00:50:02'),
	(8, 3, 5, '2020-12-19 00:50:02'),
	(9, 3, 3, '2020-12-19 00:50:02'),
	(10, 4, 11, '2020-12-19 00:50:02'),
	(11, 6, 2, '2020-12-19 00:50:02'),
	(12, 6, 11, '2020-12-19 00:50:02'),
	(13, 7, 10, '2020-12-19 00:50:02'),
	(14, 7, 9, '2020-12-19 00:50:02'),
	(15, 8, 4, '2020-12-19 00:50:02'),
	(16, 8, 2, '2020-12-19 00:50:02'),
	(17, 8, 11, '2020-12-19 00:50:02'),
	(18, 9, 10, '2020-12-19 00:50:02'),
	(19, 10, 3, '2020-12-19 00:50:02'),
	(20, 10, 2, '2020-12-19 00:50:02'),
	(21, 11, 4, '2020-12-19 00:50:02'),
	(22, 11, 2, '2020-12-19 00:50:02'),
	(23, 11, 1, '2020-12-19 00:50:02'),
	(24, 12, 5, '2020-12-19 00:50:02'),
	(25, 12, 2, '2020-12-19 00:50:02'),
	(26, 12, 1, '2020-12-19 00:50:02'),
	(27, 13, 7, '2020-12-19 00:50:02'),
	(28, 14, 6, '2020-12-19 00:50:02'),
	(29, 14, 3, '2020-12-19 00:50:02'),
	(30, 15, 9, '2020-12-19 00:50:02'),
	(31, 15, 10, '2020-12-19 00:50:02'),
	(32, 15, 4, '2020-12-19 00:50:02'),
	(33, 15, 6, '2020-12-19 00:50:02'),
	(34, 16, 7, '2020-12-19 00:50:02'),
	(35, 16, 2, '2020-12-19 00:50:02'),
	(36, 17, 1, '2020-12-19 00:50:02');
/*!40000 ALTER TABLE `book_history` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `book_interests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `book_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `books_interests_fk` (`book_id`),
  KEY `users_interests_fk` (`user_id`),
  CONSTRAINT `books_interests_fk` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `users_interests_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Contains user book interests';

/*!40000 ALTER TABLE `book_interests` DISABLE KEYS */;
INSERT INTO `book_interests` (`id`, `book_id`, `user_id`) VALUES
	(1, 16, 11);
/*!40000 ALTER TABLE `book_interests` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `book_reviews` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `book_id` bigint(20) NOT NULL,
  `creator_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `review` mediumtext NOT NULL,
  `rating` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `books_reviews_fk` (`book_id`),
  KEY `users_reviews_fk` (`creator_id`),
  CONSTRAINT `books_reviews_fk` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `users_reviews_fk` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COMMENT='Contains book reviews';

/*!40000 ALTER TABLE `book_reviews` DISABLE KEYS */;
INSERT INTO `book_reviews` (`id`, `book_id`, `creator_id`, `created_at`, `review`, `rating`) VALUES
	(1, 1, 2, '2020-12-19 00:17:06', 'Great book, very comprehensive', 5),
	(2, 1, 3, '2020-12-19 00:17:06', 'Tells you everything you need to know about JavaScript', 4),
	(3, 1, 4, '2020-12-19 00:17:06', 'I didn\'t understand a word of this, I couldn\'t install Java', 1),
	(4, 1, 5, '2020-12-19 00:17:06', 'Informative, but there are better free resources available at www.freecodecamp.org! Join today!', 3),
	(5, 1, 6, '2020-12-19 00:17:06', 'meh, I prefer HTML better, the superior coding language', 2),
	(6, 2, 8, '2020-12-19 00:17:06', 'Very useful and up to date', 5),
	(7, 3, 8, '2020-12-19 00:17:06', 'I read this cover to cover, it was amazing', 4),
	(8, 3, 5, '2020-12-19 00:17:06', 'Really good book for modern React developers', 3),
	(9, 3, 3, '2020-12-19 00:17:06', 'Upea kirja, erittäin kattava', 1),
	(10, 4, 11, '2020-12-19 00:17:06', 'Diz tudo o que você precisa saber sobre Angular', 5),
	(11, 6, 2, '2020-12-19 00:17:06', 'This book is the best thing ever in the entire world', 5),
	(12, 6, 11, '2020-12-19 00:17:06', 'Ag innse dhut a h-uile dad a dh ’fheumas tu a bhith agad mu JavaScript', 3),
	(13, 7, 10, '2020-12-19 00:17:06', 'This is good but getting a bit out of date', 3),
	(14, 7, 9, '2020-12-19 00:17:06', 'Braw!', 1),
	(15, 8, 4, '2020-12-19 00:17:06', 'Quite old now but still a really useful guide to an important technology', 4),
	(16, 8, 2, '2020-12-19 00:17:06', 'Makes a complex technology clear and understandable', 5),
	(17, 8, 11, '2020-12-19 00:17:06', 'Fac universa artes patet quod facile intellegi.', 5),
	(18, 9, 10, '2020-12-19 00:17:06', 'Quite good', 3),
	(19, 10, 3, '2020-12-19 00:17:06', 'Very up to date and covers a lot of ground', 4),
	(20, 10, 2, '2020-12-19 00:17:06', 'Comprehensive, but could be more clearly written', 3),
	(21, 11, 4, '2020-12-19 00:17:06', 'Really interesting and well written', 4),
	(22, 11, 2, '2020-12-19 00:17:06', 'I didn\'t get the point of this at all, I prefer to use Redux', 2),
	(23, 11, 1, '2020-12-19 00:17:06', 'Worth reading', 3),
	(24, 12, 5, '2020-12-19 00:17:06', 'Comprehensive, a really good guide to modern JavaScript', 5),
	(25, 12, 2, '2020-12-19 00:17:06', 'I didn\'t get the point of this at all, I prefer to use Redux', 2),
	(26, 12, 1, '2020-12-19 00:17:06', 'Worth reading', 3),
	(27, 13, 7, '2020-12-19 00:17:06', 'GraphQL is a really interesting technology for APIs and this book explains it very well', 5),
	(28, 14, 6, '2020-12-19 00:17:06', 'This is probably the worst £20 I\'ve spent since, well . . . maybe ever. The book doesn\'t give any background on actually learning core concepts of any of the development stack. There\'s no explanation given of classes/methods commonly used in React. It gives no background on what any of the NodeJS server components are doing, what\'s actually happening under the hood with Webpack, etc.', 1),
	(29, 14, 3, '2020-12-19 00:17:06', 'This is a great book! ', 4),
	(30, 15, 9, '2020-12-19 00:17:06', 'ਹੁਸ਼ਿਆਰ', 3),
	(31, 15, 10, '2020-12-19 00:17:06', 'Блестящий', 4),
	(32, 15, 4, '2020-12-19 00:17:06', 'شاندار', 5),
	(33, 15, 6, '2020-12-19 00:17:06', '훌륭한', 5),
	(34, 16, 7, '2020-12-19 00:17:06', 'Very detailed and informative', 4),
	(35, 16, 2, '2020-12-19 00:17:06', 'I didn\'t undestand a word of this', 1),
	(36, 17, 1, '2020-12-19 00:17:06', 'A classic book and, indeed, a definitive guide', 5);
/*!40000 ALTER TABLE `book_reviews` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='Contains user groups';

/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` (`id`, `name`) VALUES
	(2, 'admin'),
	(1, 'user');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` bigint(20) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` char(95) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `groups_users_fk` (`group_id`),
  CONSTRAINT `groups_users_fk` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COMMENT='Contains user data';

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `group_id`, `username`, `password`, `created_at`) VALUES
	(1, 2, 'admin', '$argon2i$v=19$m=4096,t=3,p=1$USPqfScuWqzbrgapn3PvkA$k8NGymiRUbF2gGBIW9LJBIFC3kssG/BMA8s0HaQoiy0', '2020-12-17 08:45:21'),
	(2, 1, 'user1', '$argon2i$v=19$m=4096,t=3,p=1$qP16BanIK+Lmk2WQo9wH8Q$cLuRPWBZjytYcqBdkiW60qjlgmAyfn2UMYCjl5bAJfE', '2020-12-19 00:09:06'),
	(3, 1, 'user2', '$argon2i$v=19$m=4096,t=3,p=1$qP16BanIK+Lmk2WQo9wH8Q$cLuRPWBZjytYcqBdkiW60qjlgmAyfn2UMYCjl5bAJfE', '2020-12-19 00:09:06'),
	(4, 1, 'user3', '$argon2i$v=19$m=4096,t=3,p=1$qP16BanIK+Lmk2WQo9wH8Q$cLuRPWBZjytYcqBdkiW60qjlgmAyfn2UMYCjl5bAJfE', '2020-12-19 00:09:06'),
	(5, 1, 'user4', '$argon2i$v=19$m=4096,t=3,p=1$qP16BanIK+Lmk2WQo9wH8Q$cLuRPWBZjytYcqBdkiW60qjlgmAyfn2UMYCjl5bAJfE', '2020-12-19 00:09:06'),
	(6, 1, 'user5', '$argon2i$v=19$m=4096,t=3,p=1$qP16BanIK+Lmk2WQo9wH8Q$cLuRPWBZjytYcqBdkiW60qjlgmAyfn2UMYCjl5bAJfE', '2020-12-19 00:09:06'),
	(7, 1, 'user6', '$argon2i$v=19$m=4096,t=3,p=1$qP16BanIK+Lmk2WQo9wH8Q$cLuRPWBZjytYcqBdkiW60qjlgmAyfn2UMYCjl5bAJfE', '2020-12-19 00:09:06'),
	(8, 1, 'user7', '$argon2i$v=19$m=4096,t=3,p=1$qP16BanIK+Lmk2WQo9wH8Q$cLuRPWBZjytYcqBdkiW60qjlgmAyfn2UMYCjl5bAJfE', '2020-12-19 00:09:06'),
	(9, 1, 'user8', '$argon2i$v=19$m=4096,t=3,p=1$qP16BanIK+Lmk2WQo9wH8Q$cLuRPWBZjytYcqBdkiW60qjlgmAyfn2UMYCjl5bAJfE', '2020-12-19 00:09:06'),
	(10, 1, 'user9', '$argon2i$v=19$m=4096,t=3,p=1$qP16BanIK+Lmk2WQo9wH8Q$cLuRPWBZjytYcqBdkiW60qjlgmAyfn2UMYCjl5bAJfE', '2020-12-19 00:09:06'),
	(11, 1, 'user10', '$argon2i$v=19$m=4096,t=3,p=1$qP16BanIK+Lmk2WQo9wH8Q$cLuRPWBZjytYcqBdkiW60qjlgmAyfn2UMYCjl5bAJfE', '2020-12-19 00:09:06');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;