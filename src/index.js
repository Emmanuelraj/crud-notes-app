const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const { initRedis } = require("./redis-client");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

const prisma = new PrismaClient();

async function startServer() {
  try {
    // Initialize Redis client
    const client = await initRedis();

    // 1️⃣ Create Note
    app.post('/notes', async (req, res) => {
      try {
        const { title, content } = req.body;
        const note = await prisma.note.create({
          data: { title, content }
        });

        await client.lPush(process.env.REDIS_QUEUE, JSON.stringify({ action: 'create', noteId: note.id }));
        res.status(201).json({ message: "Note created", note });
      } catch (error) {
        res.status(500).json({ "create Note is error": error });
      }
    });

    // 2️⃣ Get All Notes
    app.get('/notes', async (req, res) => {
      try {
        const notes = await prisma.note.findMany();
        res.status(200).json({ notes });
      } catch (error) {
        res.status(500).json({ message: error });
      }
    });

    // 3️⃣ Get Note By ID
    app.get('/notes/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const note = await prisma.note.findUnique({ where: { id } });

        if (!note) return res.status(404).json({ message: "Note not found" });
        res.status(200).json({ note });
      } catch (error) {
        res.status(500).json({ message: error });
      }
    });

    // Health-check & test endpoints
    app.get("/health-check", (req, res) => res.send("health-check Server is running 🚀"));
    app.get("/ci-cdpipeline", (req, res) => res.send("ci-cdpipeline Server is running 🚀"));
    app.get("/test-ci", (req, res) => res.send("CI/CD test endpoint 🚀"));

    // Update Note
    app.put('/notes/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const { title, content } = req.body;

        const note = await prisma.note.findUnique({ where: { id } });
        if (!note) return res.status(404).json({ message: "Note not found" });

        const updateNote = await prisma.note.update({
          where: { id },
          data: { title, content }
        });
        res.status(200).json({ updateNote });
      } catch (error) {
        res.status(500).json({ message: error });
      }
    });

    // Delete Note
    app.delete('/notes/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id);

        const note = await prisma.note.findUnique({ where: { id } });
        if (!note) return res.status(404).json({ message: "Note not found" });

        await prisma.note.delete({ where: { id } });
        res.status(200).json({ message: `Note deleted ID: ${id}` });
      } catch (error) {
        res.status(500).json({ message: error });
      }
    });

    // Start server only after Redis is ready
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });

  } catch (err) {
    console.error("Error starting server:", err);
  }
}

startServer();
