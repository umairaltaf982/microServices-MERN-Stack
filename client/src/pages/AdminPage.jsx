import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { bookService, orderService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || user?.role !== 'admin') {
        setLoading(false);
        return;
      }
      
      try {
        if (activeTab === 'books') {
          const booksData = await bookService.getAllBooks();
          setBooks(booksData);
        } else if (activeTab === 'orders') {
          const ordersData = await orderService.getAllOrders();
          setOrders(ordersData);
        }
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err.message);
        setError(`Failed to load ${activeTab}. Please try again later.`);
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, isAuthenticated, user]);

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, { status });
      // Refresh orders
      const ordersData = await orderService.getAllOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error('Error updating order status:', err.message);
      setError('Failed to update order status. Please try again.');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(bookId);
        // Refresh books
        const booksData = await bookService.getAllBooks();
        setBooks(booksData);
      } catch (err) {
        console.error('Error deleting book:', err.message);
        setError('Failed to delete book. Please try again.');
      }
    }
  };

  // Redirect if not admin
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return <Navigate to="/" />;
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => setActiveTab('books')}
        >
          Manage Books
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Manage Orders
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'books' && (
          <div className="admin-books">
            <h2>Books</h2>
            <button className="btn btn-primary">Add New Book</button>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>${book.price.toFixed(2)}</td>
                    <td>{book.stock}</td>
                    <td>
                      <button className="btn btn-sm btn-info">Edit</button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteBook(book._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="admin-orders">
            <h2>Orders</h2>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id.substring(0, 8)}</td>
                    <td>{order.userId}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
