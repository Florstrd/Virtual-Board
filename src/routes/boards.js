const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authorize = require("../middleware/auth");

const prisma = new PrismaClient();

router.get('/', authorize, async (req, res) => {
    try {
    console.log("notes / GET");
    const notes = await prisma.boards.findMany({
        where: {
            authorId: req.userData.sub
        }
    })
    res.send(notes);
    } catch (error) {
        res.status(500).send({msg: "ERROR"});
    }
    
})

router.post('/', authorize, async (req, res) => {
    console.log(req.body);

    try {
        const newBoard = await prisma.boards.create({
            data: {
                authorId: req.userData.sub,
                name: req.body.name
            }
        });
        res.send({ msg: "Board created!" });
    } catch (error) {
        res.status(500).send({msg: "ERROR"});
    }
})

module.exports = router;