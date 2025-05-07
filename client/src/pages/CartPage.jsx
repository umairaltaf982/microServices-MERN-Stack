import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    // In a real app, this would navigate to a checkout page
    // For now, we'll just show an alert
    alert('Checkout functionality would be implemented here');
    // navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="unauthorized">
          <p>Please <Link to="/login">log in</Link> to view your cart.</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/books" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.book._id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.book.coverImage} alt={item.book.title} />
            </div>
            <div className="cart-item-details">
              <h3>{item.book.title}</h3>
              <p className="cart-item-author">by {item.book.author}</p>
              <p className="cart-item-price">${item.book.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-actions">
              <div className="quantity-control">
                <button 
                  onClick={() => updateQuantity(item.book._id, item.quantity - 1)}
                  className="btn btn-sm"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.book._id, item.quantity + 1)}
                  className="btn btn-sm"
                  disabled={item.quantity >= item.book.stock}
                >
                  +
                </button>
              </div>
              <p className="cart-item-subtotal">
                ${(item.book.price * item.quantity).toFixed(2)}
              </p>
              <button 
                onClick={() => removeFromCart(item.book._id)}
                className="btn btn-sm btn-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <button 
          onClick={clearCart}
          className="btn btn-secondary"
        >
          Clear Cart
        </button>
        
        <div className="cart-total">
          <p>Total: <span className="total-price">${getTotalPrice().toFixed(2)}</span></p>
          <button 
            onClick={handleCheckout}
            className="btn btn-primary"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
