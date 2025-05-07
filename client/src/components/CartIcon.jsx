import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const CartIcon = () => {
  const { cartCount } = useContext(CartContext);

  return (
    <Link to="/cart" className="cart-icon">
      <span className="material-icons">shopping_cart</span>
      {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
    </Link>
  );
};

export default CartIcon;
