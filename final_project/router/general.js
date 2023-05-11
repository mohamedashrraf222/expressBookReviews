const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios").default;

public_users.post("/register", (req, res) => {
  if (isValid(req.query.username)) {
    return res.status(300).json({ message: "the username is already used" });
  } else {
    users.push({ username: req.query.username, password: req.query.password });
    return res.status(200).json({ message: "Thanks for your registration" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  return res
    .status(200)
    .json({ isbn: req.params.isbn, book: books[req.params.isbn] });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const filteredArr = [];
  for (let key in books) {
    if (books.hasOwnProperty(key) && books[key].author == req.params.author) {
      filteredArr.push(books[key]);
    }
  }

  return res.status(200).json(filteredArr);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const filteredArr = [];
  for (let key in books) {
    if (books.hasOwnProperty(key) && books[key].title == req.params.title) {
      filteredArr.push(books[key]);
    }
  }

  return res.status(200).json(filteredArr);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json({
    isbn: req.params.isbn,
    book: books[req.params.isbn],
    reviews: books[req.params.isbn].reviews,
  });
});

const gettingBooks = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/`);
    const books = response.data;
    console.log(books);
  } catch (error) {
    console.error(error);
  }
};

const gettingBooksWithIsbn = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    const books = response.data;
    console.log(books);
  } catch (error) {
    console.error(error);
  }
};

const gettingBooksWithAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    const books = response.data;
    console.log(books);
  } catch (error) {
    console.error(error);
  }
};

const gettingBooksWithTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    const books = response.data;
    console.log(books);
  } catch (error) {
    console.error(error);
  }
};

gettingBooksWithTitle('Fairy tales')



module.exports.general = public_users;
