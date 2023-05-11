const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    console.log(req.session);
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const checkUpdate = (user) => {
    for (let rev in books[req.params.isbn].reviews) {
      if (books[req.params.isbn].reviews[rev].user == user) {
        console.log("hii");
        return [true, rev];
      }
    }
    return [false];
  };
  const myCheck = checkUpdate(req.session.authorization.username);

  if (myCheck[0]) {
    books[req.params.isbn].reviews[myCheck[1]].review = req.body.review;
    return res.status(300).json({ message: "Your review is updated" });
  }

  const reviewsLength = Object.keys(books[req.params.isbn].reviews).length;

  const newReview = {
    user: req.session.authorization.username,
    review: req.body.review,
  };
  books[req.params.isbn].reviews[reviewsLength] = newReview;
  console.log(books[req.params.isbn].reviews);
  return res.status(300).json({ message: "your review is added successfully" });
});

// delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  for (let rev in books[req.params.isbn].reviews) {
    if (books[req.params.isbn].reviews[rev].user == req.session.authorization.username) {
      delete books[req.params.isbn].reviews[rev]
      console.log(books[req.params.isbn].reviews);
      return res.status(300).json({ message: "your review is deleted successfully" });
    }
  }
  return res.status(300).json({ message: "you don't have authrization to delelte a review" });
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
