const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

// POST /register - placeholder
public_users.post('/register', (req, res) => {
    return res.status(501).json({ message: "Registration not implemented yet." });
});

// GET / - Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// GET /isbn/:isbn - Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: `Book with ISBN '${isbn}' not found.` });
    }

    return res.status(200).json(book);
});

// GET /author/:author - Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;

    // Exact match
    // const matchedBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

    // Substring match (more user friendly)
    const matchedBooks = Object.values(books).filter(book => book.author.toLowerCase().includes(author));

    if (matchedBooks.length === 0) {
        return res.status(404).json({ message: `No books found by author '${author}'.` });
    }

    return res.status(200).json(matchedBooks);
});

// GET /title/:title - Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const matchedBooks = Object.values(books).filter(book => book.title === title);

    if (matchedBooks.length === 0) {
        return res.status(404).json({ message: `No books found with title '${title}'.` });
    }

    return res.status(200).json(matchedBooks);
});

// GET /review/:isbn - Get reviews for a book
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: `Book with ISBN '${isbn}' not found.` });
    }

    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
