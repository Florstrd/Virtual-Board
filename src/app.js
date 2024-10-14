const express = require("express");
require('dotenv').config();
const cors = require("cors");
const authorize = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: process.env.DEV_ORIGIN
}));

app.get("/", (req, res) => {
    res.send("<h1>Hello!</h1>");
})

app.use(express.json());
const auth = require("./middleware/auth");

const boardsRouter = require('./routes/boards');
app.use('/boards', boardsRouter);

const notesRouter = require('./routes/notes');
app.use('/notes', notesRouter);

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
}) 