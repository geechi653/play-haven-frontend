import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../../components/GameCard/GameCard.jsx';
import CheckoutModal from '../../components/CheckoutModal/CheckoutModal.jsx';
import { useGlobalStore } from '../../hooks/useGlobalStore';
import { fetchUserCart, addToCart, removeFromCart, clearCart, purchaseCart, addToLibrary } from '../../utils/api';
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
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const TAX_RATE = 0.08; 

  useEffect(() => {
    if (user.isAuthenticated && user.userId && user.token) {
      fetchUserCart(user.userId, user.token)
        .then(cartData => {
          console.log('[DEBUG] Cart data received:', cartData);
          // Backend returns array of objects with steam_game_id and game details
          setCartItems(cartData);
        })
        .catch(error => {
          console.error('[DEBUG] Failed to fetch cart:', error);
          setCartItems([]);
        });
    } else {
      setCartItems([]);
    }
  }, [user.isAuthenticated, user.userId, user.token]);

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

  // Extract games from cart items (backend returns game objects directly)
  const cartGames = cartItems
    .filter(item => item && item.id && !removedItems.has(item.id))
    .map(item => item); // items are already game objects

  console.log('[DEBUG] Cart items:', cartItems);
  console.log('[DEBUG] Cart games:', cartGames);
  console.log('[DEBUG] Removed items:', removedItems);

  const removeItemFromCart = async (gameId) => {
    try {
      await removeFromCart(user.userId, gameId, user.token);
      
      setCartItems(prev => prev.filter(item => item.id !== gameId));
      setRemovedItems(prev => new Set([...prev, gameId]));
      
      // Trigger cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { gameId: gameId, action: 'remove' } 
      }));
      
      console.log('[DEBUG] Removed from cart:', gameId);
      
    } catch (error) {
      console.error('[DEBUG] Failed to remove from cart:', error);
      // Still remove from UI even if API call fails
      setCartItems(prev => prev.filter(item => item.id !== gameId));
      setRemovedItems(prev => new Set([...prev, gameId]));
    }
  };

  const clearCartItems = async () => {
    try {
      await clearCart(user.userId, user.token);
      
      setCartItems([]);
      setRemovedItems(new Set());
      
      // Trigger cart cleared event to update navbar badge
      window.dispatchEvent(new CustomEvent('cartCleared', { 
        detail: { action: 'clear' } 
      }));
      
      console.log('[DEBUG] Cart cleared');
      
    } catch (error) {
      console.error('[DEBUG] Failed to clear cart:', error);
      // Still clear UI even if API call fails
      setCartItems([]);
      setRemovedItems(new Set());
      
      // Trigger cart cleared event even if API fails
      window.dispatchEvent(new CustomEvent('cartCleared', { 
        detail: { action: 'clear' } 
      }));
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

  const handleCheckout = () => {
    if (cartGames.length === 0) return;
    setShowCheckoutModal(true);
  };

  const handlePurchaseComplete = async () => {
    setIsCheckingOut(true);
    
    try {
      const response = await purchaseCart(user.userId, user.token);
      console.log('[DEBUG] Purchase successful:', response);
      
      // Add games to library with "new" badge
      const gameIds = cartGames.map(game => game.id);
      for (const gameId of gameIds) {
        try {
          await addToLibrary(user.userId, gameId, user.token);
          console.log('[DEBUG] Added to library:', gameId);
        } catch (error) {
          console.error('[DEBUG] Failed to add to library:', gameId, error);
        }
      }
      
      // Store recently purchased games for "new" badge
      const recentlyPurchased = gameIds.map(id => ({
        gameId: id,
        purchaseDate: Date.now()
      }));
      
      console.log('[DEBUG] Storing recently purchased games:', recentlyPurchased);
      localStorage.setItem('recentlyPurchased', JSON.stringify(recentlyPurchased));
      
      // Clear cart on server and locally
      try {
        await clearCart(user.userId, user.token);
        console.log('[DEBUG] Cart cleared on server');
      } catch (error) {
        console.error('[DEBUG] Failed to clear cart on server:', error);
      }
      
      // Clear cart locally
      setCartItems([]);
      setRemovedItems(new Set());
      setPurchaseSuccess(true);
      
      // Trigger cart update event to update navbar badge
      window.dispatchEvent(new CustomEvent('cartCleared', { 
        detail: { action: 'clear' } 
      }));
      
      // Navigate to library page with success message
      setTimeout(() => {
        navigate('/library', { 
          state: { 
            purchaseSuccess: true,
            purchasedGames: cartGames.length,
            message: `Successfully purchased ${cartGames.length} game${cartGames.length !== 1 ? 's' : ''}!` 
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('[DEBUG] Checkout failed:', error);
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setIsCheckingOut(false);
      setShowCheckoutModal(false);
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

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onPurchase={handlePurchaseComplete}
        totalAmount={calculateTotal()}
        itemCount={cartGames.length}
      />

      {/* Purchase Success Message */}
      {purchaseSuccess && (
        <div className="success-overlay">
          <div className="success-message glass-effect">
            <div className="success-content">
              <h3>Purchase Complete</h3>
              <p>Games added to your library</p>
              <div className="success-indicator"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

