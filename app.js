if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const route = require("./src/routes/mailRoute");
const errorHandler = require("./src/middleware/errorHandler");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const app = express();
const PORT = 9090;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
	req.io = io;
	next();
});

app.use("/api/v1", route);

app.use(errorHandler);

const server = app.listen(PORT, () => {
	console.log(`-> Listening on Port: ${PORT}`);
});

const io = new Server(server);

io.on("connection", (socket) => {
	console.log("Websocket Connected!!!");
});
