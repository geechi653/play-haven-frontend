import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoTrashOutline, IoStorefrontOutline } from 'react-icons/io5';
import { FaRegEye } from 'react-icons/fa6';
import './Cart.css';

function Cart() {
  // Mock cart data - replace with actual cart state later
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Cyberpunk Odyssey",
      description: "An immersive open-world RPG set in a dystopian cyberpunk future.",
      image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "59.99",
      original_price: "79.99",
      discount: 25,
      platform: ["Windows", "Mac", "Linux"],
      genres: ["RPG", "Action", "Sci-Fi"]
    },
    {
      id: 2,
      title: "Stellar Conquest",
      description: "A grand strategy space game where you build and manage your own galactic empire.",
      image_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      price: "49.99",
      original_price: null,
      discount: null,
      platform: ["Windows", "Mac"],
      genres: ["Strategy", "Simulation", "Sci-Fi"]
    }
  ]);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Helper Functions
  const getPlatformIcon = (platform) => {
    const icons = {
      windows: 'Windows',
      linux: 'Linus',
      ios: 'iOS',
      mac: 'iOS',
      android: 'Android'
    };
    return icons[platform.toLowerCase()] || '🎮';
  };

  const getCurrentPrice = (item) => {
    return item.discount && item.original_price 
      ? (parseFloat(item.original_price) * (100 - item.discount) / 100).toFixed(2)
      : parseFloat(item.price).toFixed(2);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + parseFloat(getCurrentPrice(item)), 0).toFixed(2);
  };

  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => {
      if (item.discount && item.original_price) {
        return total + (parseFloat(item.original_price) - parseFloat(getCurrentPrice(item)));
      }
      return total;
    }, 0).toFixed(2);
  };

  // Event Handlers
  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
    }, 1000);
  };

  // Render Components
  const renderPlatformBadges = (platforms) => (
    <div className="platform-badges">
      {platforms.map((platform, index) => (
        <span key={index} className="platform-badge" title={platform}>
          {getPlatformIcon(platform)}
        </span>
      ))}
    </div>
  );

  const renderDiscountBadge = (discount) => (
    discount && (
      <div className="discount-badge">
        -{discount}%
      </div>
    )
  );

  const renderPrice = (item) => (
    <div className="cart-item-price">
      {item.discount && item.original_price ? (
        <>
          <span className="original-price">${parseFloat(item.original_price).toFixed(2)}</span>
          <span className="discounted-price">${getCurrentPrice(item)}</span>
        </>
      ) : (
        <span className="current-price">${parseFloat(item.price).toFixed(2)}</span>
      )}
    </div>
  );

  const renderCartItem = (item) => (
    <div key={item.id} className="cart-item">
      <div className="row g-0 h-100">
        <div className="col-md-3">
          <div className="cart-item-image-container">
            <img 
              src={item.image_url} 
              alt={item.title}
              className="cart-item-image"
            />
            {renderPlatformBadges(item.platform)}
            {renderDiscountBadge(item.discount)}
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="cart-item-content">
            <h5 className="cart-item-title">{item.title}</h5>
            <p className="cart-item-description">{item.description}</p>
            <div className="cart-item-genres">
              {item.genres.map((genre, index) => (
                <span key={index} className="genre-tag">{genre}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="cart-item-actions">
            {renderPrice(item)}
            
            <div className="cart-item-buttons">
              <Link 
                to="/gameinfo/:gameId" 
                className="cart-action-btn info-btn"
                title="More Info"
              >
                <FaRegEye />
                Info
              </Link>
              
              <button 
                className="cart-action-btn remove-btn"
                onClick={() => handleRemoveItem(item.id)}
                title="Remove from Cart"
              >
                <IoTrashOutline />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        {/* Page Header */}
        <div className="cart-header">
          <h1 className="cart-title">Your Cart</h1>
          <p className="cart-subtitle">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items">
              <div className="cart-items-header">
                <h3>Items in Cart</h3>
                <button 
                  className="clear-cart-btn"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="cart-items-list">
                {cartItems.map(item => renderCartItem(item))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <div className="summary-card">
                <h3 className="summary-title">Order Summary</h3>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${getTotalPrice()}</span>
                  </div>
                  
                  {parseFloat(getTotalSavings()) > 0 && (
                    <div className="summary-row savings">
                      <span>You Save</span>
                      <span>-${getTotalSavings()}</span>
                    </div>
                  )}
                  
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${getTotalPrice()}</span>
                  </div>
                </div>

                <div className="summary-actions">
                  <button 
                    className={`checkout-btn ${isCheckingOut ? 'checking-out' : ''}`}
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                  </button>
                  
                  <Link 
                    to="/store" 
                    className="continue-shopping-btn"
                  >
                    <IoStorefrontOutline />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-content">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your Cart is Empty</h3>
              <p>
                You haven't added any games to your cart yet. Browse our store to find amazing games 
                and add them to your cart!
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/store" className="btn btn-primary">
                  <IoStorefrontOutline />
                  Browse Store
                </Link>
                <Link to="/home" className="btn btn-outline-primary">
                  View Featured Games
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;