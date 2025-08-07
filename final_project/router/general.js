const express = require('express');
const axios = require('axios');
const public_users = express.Router();

// POST /register - placeholder
const { registerUser } = require('./auth_users.js');
public_users.post('/register', registerUser);

// Sync mode version
// const books = require('./booksdb.js');

// The following code is to demo 'Axios-Async' mode
const BOOK_SERVICE_PORT = process.env.BOOK_SERVICE_PORT || 5000;
const BOOK_SERVICE_HOST = process.env.BOOK_SERVICE_HOST || 'localhost';

// Common function to fetch books from all functions
async function fetchAllBooks() {
    try {
        const url = `http://${BOOK_SERVICE_HOST}:${BOOK_SERVICE_PORT}/books`;
        const response = await axios.get(url);

        const books = response.data;
        if (!books || typeof books !== 'object' || Object.keys(books).length === 0) {
            console.warn('refbookdb.js returned empty or invalid data.');
            return null;
        }
        return books;
    } catch (err) {
        console.error('Error in fetchAllBooks:', err.message);
        return null; // Or throw err;
    }
}

// GET / - Get all books 
public_users.get('/', async (req, res) => {
    try {
        const books = await fetchAllBooks();
        if (!books) {
            return res.status(503).json({ message: 'Book database is currently unavailable.' });
        }
        return res.status(200).json(books);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching book list', error: err.message });
    }
});

// GET /isbn/:isbn - Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const books = await fetchAllBooks();
        if (!books) {
            return res.status(503).json({ message: 'Book database is currently unavailable.' });
        }
        const book = books[isbn];

        if (!book) {
            return res.status(404).json({ message: `Book with ISBN '${isbn}' not found.` });
        }
        return res.status(200).json(book);

    } catch (err) {
        return res.status(500).json({ message: 'Error fetching book list', error: err.message });
    }
});

// GET /author/:author - Get books by author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    const books = await fetchAllBooks();
    if (!books) {
        return res.status(503).json({ message: 'Book database is currently unavailable.' });
    }

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
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    const books = await fetchAllBooks();
    if (!books) {
        return res.status(503).json({ message: 'Book database is currently unavailable.' });
    }

    const matchedBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));

    if (matchedBooks.length === 0) {
        return res.status(404).json({ message: `No books found with title '${title}'.` });
    }

    return res.status(200).json(matchedBooks);
});

// GET /review/:isbn - Get reviews for a book
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const books = await fetchAllBooks();
    if (!books) {
        return res.status(503).json({ message: 'Book database is currently unavailable.' });
    }
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: `Book with ISBN '${isbn}' not found.` });
    }

    return res.status(200).json(book.reviews);
});

// GET /isbn - Get books but isbn name not mentioned
public_users.get('/isbn', (req, res) => {
    res.status(400).json({ message: "Please specify a valid isbn (e.g. /isbn/:isbn)" });
});

// GET /author - Get books but author name not mentioned
public_users.get('/author', (req, res) => {
    res.status(400).json({ message: "Please specify a valid author name (e.g. /author/:author)" });
});

// GET /title - Get books but title name not mentioned
public_users.get('/title', (req, res) => {
    res.status(400).json({ message: "Please specify a valid title (e.g. /title/:title)" });
});

// GET /review - Get review but isbn name not mentioned
public_users.get('/review', (req, res) => {
    res.status(400).json({ message: "Please specify a valid isbn (e.g. /review/:isbn)" });
});

// Original code in 'Sync' mode
/*
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
*/

module.exports.general = public_users;
