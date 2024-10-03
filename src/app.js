const express = require("express");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("<h1>Hello!</h1>");
})

app.use(express.json());

const notesRouter = require('./routes/notes');
app.use('/notes', notesRouter);

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
}) 