import { useState, useEffect } from 'react';
import BookSearch from '../components/BookSearch';
import BookInfo from './BookInfo';
import { createEntry, editEntry, checkEntryExists } from '../api/listApi';

function Home({ user }) {
  const [books, setBooks] = useState([]);
  //state for book popup dialog
  const [selectedBook, setSelectedBook] = useState(null);
  const [loadingBook, setLoadingBook] = useState(false);


  console.log(user);
  const handleSearch = async (query) => {
    const res = await fetch(`http://localhost:5000/books/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setBooks(data);
  };


  //function to handle request for additional book info
  //Open Library's search returns little info, so further info needs to be requested
  const handleBookClick = async (book) => {
    setLoadingBook(true);

    try {
        if (!book.key) {
          console.error("Missing book.key", book);
          setSelectedBook(book);
          return;
        }

        const url = `https://openlibrary.org${book.key}.json`;

        const res = await fetch(url);
        const data = await res.json();

        setSelectedBook({
          ...book,
          description:
            typeof data.description === "string"
              ? data.description
              : data.description?.value || "No description available",
          subjects: data.subjects || [],
          firstPublishDate: data.first_publish_date
        });
      } catch (err) {
        console.error("Failed to fetch book details:", err);
        setSelectedBook(book);
      } finally {
        setLoadingBook(false);
      }
  };


  //helper function for book info
 const handleAddToList = async ({ book, rating, status }) => {
  try {
    const user_id = user.uid;
    const book_id = book.key;

    //check if entry exists
    const check = await checkEntryExists(user_id, book_id);

    const entry = {
      user_id,
      book_id,
      status,
      rating,
    };
    //if it exists update
    if (check.exists) {
      const updated = await editEntry(entry);
      console.log("Entry updated:", updated);
    } else {
       //if not add it
      const created = await createEntry(entry);
      console.log("Entry created:", created);
    }
  } catch (err) {
    console.error("Failed to add/update entry:", err);
  }
};

  return (
    <div>
      <h1>Welcome to bookworm yay!</h1>
      <BookSearch onSearch={handleSearch} />
      <ul>
        {books.map((book) => (
        <li key={book.id} 
            style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}
            onClick={() => handleBookClick(book)}>
          {book.thumbnail && (
            <img src={book.thumbnail} alt={book.title} width={60} />
          )}
          <div>
            <strong>{book.title}</strong>
            <p>{book.authors.join(', ')}</p>
          </div>
        </li>
      ))}
      </ul>
      <BookInfo
        book={selectedBook}
        open={!!selectedBook || loadingBook}
        loading={loadingBook}
        onClose={() => setSelectedBook(null)}
        onAddToList={handleAddToList}
      />
    </div>
  )
}

export default Home;