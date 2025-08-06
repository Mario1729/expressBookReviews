const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4));
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    let book = books[isbn];
    if (book)
        res.send(book);
    else
        res.send('This ISBN \'' + isbn + '\' is not available.');
    // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksArray = Object.values(books);
    let book = booksArray.filter((item)=>item.author === author);
    if (book.length > 0)
        res.send(book);
    else
        res.send('This author \'' + author + '\' is not available.');
    // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksArray = Object.values(books);
    let book = booksArray.filter((item)=>item.title === title);
    if (book.length > 0)
        res.send(book);
    else
        res.send('This title \'' + title + '\' is not available.');
    // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);

    // 1. Get the object
    const book = books[isbn];
    if (book){
        // 2. Convert the JavaScript object to a JSON string (optional, but common for JSON)
        const jsonString = JSON.stringify(book);

        // 3. You can then parse it back to a JavaScript object if needed
        const parsedObject = JSON.parse(jsonString);

        return res.send(parsedObject.reviews);
    }
    return res.send('This ISBN \'' + isbn + '\' is not available.');
    // return res.status(300).json({message: "Yet to be implemented"});
 });

module.exports.general = public_users;
