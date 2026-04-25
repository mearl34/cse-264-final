import { useState } from 'react';
import BookSearch from '../components/BookSearch';
import BookInfo from './BookInfo';
function Home({ user }) {
  const [books, setBooks] = useState([]);
  //state for book popup dialog
  const [selectedBook, setSelectedBook] = useState(null);
  const [loadingBook, setLoadingBook] = useState(false);

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
        onAddToList={console.log("hi")}
      />
    </div>
  )
}

export default Home;