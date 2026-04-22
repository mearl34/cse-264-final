import express from 'express'

const router = express.Router();

router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query is required" });

  try {
    const response = await fetch(
      `https://gutendex.com/books?search=${encodeURIComponent(q)}`
    );
    const data = await response.json();
    const books = data.results?.map((book) => ({
      id: book.id,
      title: book.title,
      authors: book.authors?.map((a) => a.name) || [],
      genres: book.subjects || [],
      languages: book.languages || [],
      thumbnail: book.formats?.["image/jpeg"] || null,
      download: book.formats?.["text/html"] || null,
    }));
    res.json(books || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

export default router;