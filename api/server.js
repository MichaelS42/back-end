const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authenticate = require('./auth/authenticate-middleware.js.js');
const authRouter = require('./../routers/auth-router.js');
const usersRouter = require('./../routers/users-router.js');
const recipesRouter = require('./../routers/recipes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);
server.use("/api/recipes", recipesRouter);

server.get("/", (req, res) => {
    res.status(200).json({ api: "server is UP^" });
});

function errorHandler(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message || " server err"
    });
}

server.use(errorHandler)

module.exports = server;