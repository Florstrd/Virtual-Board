const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    console.log(req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        const newUser = await prisma.users.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }
        });
        res.send({ msg: "User created!" });
    } catch (error) {
        res.status(500).send({msg: "ERROR"});
    }
});

router.post('/login', async (req, res) => {
    const user = await prisma.users.findUnique({
        where: { email: req.body.email }
    });
    if (user == null) {
        console.log("No such user");
        return res.status(401).send({ msg: "Wrong username or password" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
        console.log("Wrong password");
        return res.status(401).send({ msg: "Wrong username or password" });
    }

    const token = await jwt.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
    }, process.env.JWT_SECRET);

    res.send({ msg: "Login success", jwt: token});
})

module.exports = router;