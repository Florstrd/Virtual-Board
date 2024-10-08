const express = require("express");
require('dotenv').config();
const cors = require("cors");
const Websocket = require("ws");
const authorize = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 8080;
const WS_PORT = process.env.WS_PORT || 5000;

const wss = new Websocket.Server({ port: WS_PORT });

wss.on("connection", (ws, req) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        console.log("Received: ", message);

        ws.send(JSON.stringify({
            status: 0,
            msg: String(message)
        }));
    });

    ws.on("close", () => {
        console.log("Client disconnected")
    })
})

app.use(cors({
    origin: process.env.DEV_ORIGIN
}));

app.get("/", (req, res) => {
    res.send("<h1>Hello!</h1>");
})

app.use(express.json());

const notesRouter = require('./routes/notes');
app.use('/notes', notesRouter);

const usersRouter = require("./routes/users");
const auth = require("./middleware/auth");
app.use("/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
}) 