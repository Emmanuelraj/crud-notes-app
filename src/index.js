const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;
// body-parser
app.use(express.json());

// ✅ PrismaClient for Prisma 7+ (no arguments)
const prisma = new PrismaClient();

//1️⃣ Create Note
app.post('/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await prisma.note.create({
            data: {
                title: title,
                content: content
            }
        });
        res.status(201).json({ message: "Note created", note });
    } catch (error) {
        res.status(500).json({ "create Note is error": error });
    }
});

//2️⃣ Get All Notes
app.get('/notes', async (req, res) => {
    try {
        
         const notes =  await prisma.note.findMany()
    return res.status(201).json({
      notes
    });
  } catch (error) {
      return res.status(500).json({ message: error }); 
  }

});

//3️⃣ Get Note By ID
app.get('/notes/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
         const note =  await prisma.note.findUnique({
      where:{
         id: id
      }}
    )
     if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(201).json({
      note
    });
  } catch (error) {
      return res.status(500).json({ message: error }); 
  }
});


// update By Id
app.put('/notes/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {title, content} = req.body;
        // checking in DB
        const note = await prisma.note.findUnique({
            where:
            {
                id : id
            }
        });
        // if exists
        if(note){
            // Take that id and update the values from req.body
            const updateNote = await prisma.note.update({
              where: {
                id
              },
              data: {
                title: title,
                content: content
              }
            });
            return res.status(200).json({
                updateNote
            });
        }else{
            return res.status(404).json({ message: "Note not found" });
        } 
        
    } catch (error) {
        return res.status(500).json({ message: error }); 
    }
});


app.delete('/notes/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // checking in DB
        const note = await prisma.note.findUnique({
            where:
            {
                id : id
            }
        });
        // if exists
        if(note){
            // Take that id and update the values from req.body
            const updateNote = await prisma.note.delete({
              where: {
                id
              }
            });
            return res.status(200).json({
                message :`Note deleted ID : ${id}`
            });
        }else{
            return res.status(404).json({ message: "Note not found" });
        } 
        
    } catch (error) {
        return res.status(500).json({ message: error }); 
    }
});

app.listen(port, () => {
    //console.log(`server listening on port ${port}`);
});
