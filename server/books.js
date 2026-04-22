import express from 'express'

const router = express.Router();

router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query is required" });

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}`
    );
    const data = await response.json();
    const books = data.docs?.map((book) => ({
      id: book.key,
      title: book.title,
      authors: book.author_name || [],
      genres: book.subject || [],
      languages: book.language || [],
      thumbnail: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
      year: book.first_publish_year || null,
    }));
    res.json(books || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

export default router;