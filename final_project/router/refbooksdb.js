const express = require('express');
const books = require('./booksdb.js');
const booksref = express.Router();

booksref.get('/', (req, res) => {
    console.log("inside refbooksdb.js");
    return res.status(200).json(books);
});

module.exports.booksroute = booksref;
