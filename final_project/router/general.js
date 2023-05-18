const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => resolve(res.send(JSON.stringify(books, null, '\t'))));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if(book) {
        resolve(res.send(JSON.stringify(book, null, '\t')));
    }
    reject(res.status(404).json({message: "Book not found."}));
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books.filter(book => book.author === req.params.author), null, '\t')));
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books.filter(book => book.title === req.params.title), null, '\t')));
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book = books[req.params.isbn];
    if(book) {
        return res.send(JSON.stringify(book.reviews, null, '\t'));
    }
    return res.status(404).json({message: "Book not found."});
});

module.exports.general = public_users;
