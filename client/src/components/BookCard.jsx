import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const BookCard = ({ book }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  return (
    <div className="book-card">
      <img src={book.coverImage} alt={book.title} className="book-cover" />
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        <p className="book-price">${book.price.toFixed(2)}</p>
        <div className="book-actions">
          <Link to={`/books/${book._id}`} className="btn btn-info">
            Details
          </Link>
          {book.stock > 0 ? (
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  // Redirect to login page
                  navigate('/login');
                  return;
                }
                const result = addToCart(book);
                if (result.success) {
                  setMessage('Added to cart!');
                  setTimeout(() => setMessage(''), 2000);
                }
              }}
              className="btn btn-primary"
            >
              Add to Cart
            </button>
          ) : (
            <button className="btn btn-secondary" disabled>
              Out of Stock
            </button>
          )}
          {message && <div className="book-message">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
