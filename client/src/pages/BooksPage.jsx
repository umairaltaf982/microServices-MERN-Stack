import { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import BookCard from '../components/BookCard';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.getAllBooks();
        setBooks(data);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(book => book.category))];
        setCategories(uniqueCategories);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching books:', err.message);
        setError('Failed to load books. Please try again later.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);



  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      let data;
      if (category === 'all') {
        data = await bookService.getAllBooks();
      } else {
        data = await bookService.getBooksByCategory(category);
      }
      setBooks(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching books by category:', err.message);
      setError('Failed to load books. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="books-page">
      <h1>Browse Books</h1>

      <div className="category-filter">
        <label htmlFor="category">Filter by Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="book-grid">
        {books.map(book => (
          <BookCard
            key={book._id}
            book={book}
          />
        ))}
      </div>

      {books.length === 0 && (
        <p className="no-books">No books found in this category.</p>
      )}
    </div>
  );
};

export default BooksPage;
