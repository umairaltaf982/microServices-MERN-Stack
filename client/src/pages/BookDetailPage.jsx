import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await bookService.getBookById(id);
        setBook(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching book details:', err.message);
        setError('Failed to load book details. Please try again later.');
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= book.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Redirect to login page
      navigate('/login');
      return;
    }

    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(book);
    }

    setMessage(`Added ${quantity} of ${book.title} to cart`);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div className="error">Book not found</div>;

  return (
    <div className="book-detail-page">
      <div className="book-detail-container">
        <div className="book-detail-image">
          <img src={book.coverImage} alt={book.title} />
        </div>
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <p className="book-author">by {book.author}</p>
          <p className="book-category">Category: {book.category}</p>
          <p className="book-price">${book.price.toFixed(2)}</p>
          <p className="book-stock">
            {book.stock > 0
              ? `${book.stock} in stock`
              : 'Out of stock'}
          </p>
          <div className="book-description">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>

          {book.stock > 0 && (
            <div className="book-purchase">
              <div className="quantity-control">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={book.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
              >
                Add to Cart
              </button>
              {message && <div className="book-message">{message}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
