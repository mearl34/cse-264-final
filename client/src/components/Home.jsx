import { useState } from 'react';
import BookSearch from '../components/BookSearch';

function Home({ user }) {
  const [books, setBooks] = useState([]);

  const handleSearch = async (query) => {
    const res = await fetch(`http://localhost:5000/books/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setBooks(data);
  };

  return (
    <div>
      <h1>Welcome to bookworm yay!</h1>
      <BookSearch onSearch={handleSearch} />
      <ul>
        {books.map((book) => (
        <li key={book.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
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
    </div>
  )
}

export default Home;