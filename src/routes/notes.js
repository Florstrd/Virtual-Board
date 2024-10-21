const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authorize = require("../middleware/auth");

const prisma = new PrismaClient();

router.get('/', authorize, async (req, res) => {
    try {
    console.log("notes / GET");
    const notes = await prisma.notes.findMany({
    })
    res.send(notes);
    } catch (error) {
        res.status(500).send({msg: "ERROR"});
    }
    
})

router.post('/', authorize, async (req, res) => {
    console.log(req.body);

    try {
        const newNote = await prisma.notes.create({
            data: {
                boardId: req.body.boardId,
                note: req.body.note,
                style: req.body.style
            }
        });
        res.send({ msg: "Note added!" });
    } catch (error) {
        res.status(500).send({msg: "ERROR"});
    }
})

router.patch('/:id', async (req, res) => {
    console.log(req.body);

    try {
        const updateNote = await prisma.notes.update({
            where: {
              id: req.params.id
            },
            data: {
              note: req.body.note,
            }
          });
    
        res.send({ msg: "Note edited!" });
    } catch (error) {
        res.status(500).send({msg: "ERROR"});
    }

});

router.delete('/:id', async (req, res) => {

    try {
        const deleteNote = await prisma.notes.delete({
            where: {
              id: req.params.id
            }
        });
        res.send({ msg: "Note deleted!"})
    } catch (error) {
        res.status(500).send({msg: "ERROR"});
    }
});

module.exports = router;