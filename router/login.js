const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const router = express.Router();
const users = require("../users.json");
const loggers = require('../utility/logger')
require("dotenv").config();

// Register a new user
router.post("/register", (req, res) => {
  //console.log("req", req.body)
  const { username, password } = req.body;
  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = { username, password };
  users.push(newUser);
  fs.writeFileSync("./users.json", JSON.stringify(users));

  res.status(201).json({ message: "User registered successfully" });
});

// Login and generate JWT
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username: user.username }, process.env.jwt_secret, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  //console.log("token", token)
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.jwt_secret);
    req.user = decoded;
    next();
  } catch(err) {
    console.log("******")
    next(err);

  }
}

// Protected route example
router.get("/profile", authenticateToken, loggers, (req, res) => {
  return res.json({ message: `Welcome, ${req.user.username}` });
});

router.get("/settings", authenticateToken, loggers,(req, res) => {
  return res.json({ message: ` Settings for ${req.user.username}` });
});

module.exports = router;
