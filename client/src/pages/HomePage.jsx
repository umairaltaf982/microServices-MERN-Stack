import { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import BookCard from '../components/BookCard';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.getAllBooks();
        setBooks(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching books:', err.message);
        setError('Failed to load books. Please try again later.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);



  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-page">
      <h1>Welcome to the Online Bookstore</h1>
      <p>Browse our collection of books and find your next favorite read!</p>

      <h2>Featured Books</h2>
      <div className="book-grid">
        {books.slice(0, 6).map(book => (
          <BookCard
            key={book._id}
            book={book}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
