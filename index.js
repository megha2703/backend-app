const express = require("express");
const cors = require("cors");
const app = express();
const products = require("./router/products");
const auth = require("./router/login");
const cache = require("./router/cache_test.js");
const http = require("http");
const db_crud = require("./router/crud");
const timeSocket = require("./utility/socket.js");
const logger = require("./utility/logger.js");
require('dotenv').config();

// Error handling middleware
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use(async (err, req, res, next) => {
  logger.errorLogger.error("Error: " + err + "in request" + req.url);
  res.status(500);
  res.json({ message: err.message, status: false });
});

//Task 1: Create a simple CRUD API for a product inventory
app.use("/api/products", products);

//Task 2: Implement user authentication using JWT
app.use("/api/users", auth);

//Task 3: Fetch data from an external API and implement caching to optimize performance
app.use("/api/cache", cache);

//Task 4: Integrate a database to store and retrieve data
app.use("/api/db/crud", db_crud);


//Task 5: Implement real-time notifications using WebSockets
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

timeSocket(io);

const PORT = process.env.port || 4000
server.listen(PORT, () => {
  console.log("App Server is listening on port" + PORT);
});
