import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../../components/GameCard/GameCard.jsx';
import { useGlobalStore } from '../../hooks/useGlobalStore';
import { fetchUserCart, addToCart, removeFromCart, clearCart } from '../../utils/api';
import { IoTrashOutline } from "react-icons/io5";
import './Cart.css';

function Cart() {
  const { store, dispatch } = useGlobalStore();
  const navigate = useNavigate();
  const games = store.games.allGames;
  const user = store.user;
  const cart = store.cart?.items || [];

  const [cartItems, setCartItems] = useState([]);
  const [removedItems, setRemovedItems] = useState(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const TAX_RATE = 0.08; 

  useEffect(() => {
    if (user.isAuthenticated && user.userId) {
      fetchUserCart(user.userId)
        .then(items => {
          dispatch({ type: 'SET_CART', payload: { items } });
          setCartItems(items);
        })
        .catch(() => {
          dispatch({ type: 'SET_CART', payload: { items: [] } });
          setCartItems([]);
        });
    }
  }, [user.isAuthenticated, user.userId, dispatch]);

  useEffect(() => {
    const handleCartUpdate = (event) => {
      const { gameId, action } = event.detail;
      if (action === 'remove') {
        setRemovedItems(prev => new Set([...prev, gameId]));
      } else if (action === 'add') {
        setRemovedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(gameId);
          return newSet;
        });
      }
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const cartGames = games.filter(game =>
    user.isAuthenticated &&
    cartItems.some(item => item.gameId === game.id) &&
    !removedItems.has(game.id)
  );

  const removeItemFromCart = async (gameId) => {
    try {
      await removeFromCart(user.userId, gameId);
      
      setCartItems(prev => prev.filter(item => item.gameId !== gameId));
      
      setRemovedItems(prev => new Set([...prev, gameId]));
      
      dispatch({ type: 'REMOVE_FROM_CART', payload: { gameId } });
      
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      setCartItems(prev => prev.filter(item => item.gameId !== gameId));
      setRemovedItems(prev => new Set([...prev, gameId]));
      dispatch({ type: 'REMOVE_FROM_CART', payload: { gameId } });
    }
  };

  const clearCartItems = async () => {
    try {
      await clearCart(user.userId);
      
      setCartItems([]);
      setRemovedItems(new Set());
      dispatch({ type: 'CLEAR_CART' });
      
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setCartItems([]);
      setRemovedItems(new Set());
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const getCurrentPrice = (game) => {
    if (game.status === "Free" || game.price === 0 || game.price === "0" || game.price === "0.00") {
      return 0;
    }
    
    // If there's a discount and original price, calculate the discounted price
    if (game.discount && game.discount > 0 && game.original_price) {
      const originalPrice = typeof game.original_price === 'string' 
        ? parseFloat(game.original_price) 
        : game.original_price;
      return (originalPrice * (100 - game.discount)) / 100;
    }
    
    // Otherwise return the regular price
    const price = typeof game.price === 'string' ? parseFloat(game.price) : game.price || 0;
    return price;
  };

  const calculateSubtotal = () => {
    return cartGames.reduce((total, game) => {
      return total + getCurrentPrice(game);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * TAX_RATE;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = async () => {
    if (cartGames.length === 0) return;
    
    setIsCheckingOut(true);
    
    try {
      // TODO: Implement actual checkout logic
      // This could involve payment processing, order creation, etc.
      
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearCartItems();
      
      navigate('/checkout-success');
      
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const renderCartItem = (game) => (
    <div key={game.id} className="cart-item">
      <div className="cart-item-game">
        <div className="cart-item-image">
          <img src={game.image_url} alt={game.title} />
        </div>
        
        <div className="cart-item-details">
          <h5 className="cart-item-title">{game.title}</h5>
          <p className="cart-item-description">{game.description}</p>
          
          <div className="cart-item-price">
            {game.discount && game.original_price ? (
              <>
                <span className="original-price">${game.original_price}</span>
                <span className="discounted-price">${getCurrentPrice(game).toFixed(2)}</span>
                <span className="discount-badge">-{game.discount}%</span>
              </>
            ) : (
              <span className="current-price">
                {getCurrentPrice(game) === 0 ? 'Free' : `$${getCurrentPrice(game).toFixed(2)}`}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="cart-item-controls">
        <div className="item-total">
          ${getCurrentPrice(game).toFixed(2)}
        </div>
        
        <button 
          className="remove-btn"
          onClick={() => removeItemFromCart(game.id)}
          title="Remove from cart"
        >
          <IoTrashOutline />
        </button>
      </div>
    </div>
  );

  const renderCartSummary = () => (
    <div className="cart-summary">
      <h3 className="summary-title">Order Summary</h3>
      
      <div className="summary-line">
        <span>Subtotal ({cartGames.length} items)</span>
        <span>${calculateSubtotal().toFixed(2)}</span>
      </div>
      
      <div className="summary-line">
        <span>Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
        <span>${calculateTax().toFixed(2)}</span>
      </div>
      
      <div className="summary-line total-line">
        <span>Total</span>
        <span>${calculateTotal().toFixed(2)}</span>
      </div>
      
      <button 
        className={`checkout-btn ${isCheckingOut ? 'checking-out' : ''}`}
        onClick={handleCheckout}
        disabled={cartGames.length === 0 || isCheckingOut}
      >
        {isCheckingOut ? 'Processing...' : `Checkout - $${calculateTotal().toFixed(2)}`}
      </button>
      
      {cartGames.length > 0 && (
        <button 
          className="clear-cart-btn"
          onClick={clearCartItems}
        >
          Clear Cart
        </button>
      )}
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            {cartGames.length} item{cartGames.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {!user.isAuthenticated ? (
          <div className="no-items-message">
            <div className="no-items-content">
              <h3>Please Log In</h3>
              <p>
                You need to be logged in to view your cart. 
                Please log in to see your selected games.
              </p>
              <a href="/login" className="btn btn-primary">
                Log In
              </a>
            </div>
          </div>
        ) : cartGames.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-items-header">
                <h2>Items in Cart</h2>
              </div>
              
              {cartGames.map(game => renderCartItem(game))}
            </div>
            
            <div className="cart-sidebar">
              {renderCartSummary()}
            </div>
          </div>
        ) : (
          <div className="no-items-message">
            <div className="no-items-content">
              <h3>Your Cart is Empty</h3>
              <p>
                You haven't added any games to your cart yet. Browse our store to find amazing games 
                and add them to your cart for purchase!
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <a href="/store" className="btn btn-primary">
                  Browse Store
                </a>
                <a href="/wishlist" className="btn btn-outline-primary">
                  View Wishlist
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

