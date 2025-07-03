import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { IoCartOutline, IoPlayOutline, IoDownloadOutline, IoHeartDislikeOutline } from "react-icons/io5";
import { FaRegHeart, FaRegEye } from "react-icons/fa6";
import { useGlobalStore } from '../../hooks/useGlobalStore';
import { addToWishlist, removeFromWishlist, addToLibrary, addToCart, removeFromCart } from '../../utils/api';
import './GameCard.css';

function GameCard({ 
  game, 
  cardType = 'featured',
  isUserLoggedIn = false,
  showNewBadge = false
}) {
  const { store } = useGlobalStore();
  const user = store.user;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(game.isInLibrary || false);
  const [showLibraryNewBadge, setShowLibraryNewBadge] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if game is in cart on component mount
    const checkCartStatus = async () => {
      if (user.isAuthenticated && user.userId && user.token) {
        try {
          const { fetchUserCart } = await import('../../utils/api');
          const cartItems = await fetchUserCart(user.userId, user.token);
          // Check if this game is in the cart
          const gameInCart = cartItems.some(item => 
            item.steam_game_id === game.id || item.game?.id === game.id
          );
          setIsInCart(gameInCart);
        } catch (error) {
          console.error('[DEBUG] Error checking cart status:', error);
        }
      }
    };

    checkCartStatus();
  }, [user.isAuthenticated, user.userId, user.token, game.id]);

  useEffect(() => {
    // Check if this game should show the library "NEW" badge
    const checkLibraryNewBadge = () => {
      const recentlyAddedToLibrary = JSON.parse(localStorage.getItem('recentlyAddedToLibrary') || '[]');
      const twoMinutesAgo = Date.now() - (2 * 60 * 1000); // 2 minutes in milliseconds
      
      // Filter out entries older than 2 minutes
      const validEntries = recentlyAddedToLibrary.filter(entry => entry.addedDate > twoMinutesAgo);
      
      // Update localStorage with filtered entries
      localStorage.setItem('recentlyAddedToLibrary', JSON.stringify(validEntries));
      
      // Check if this game has a recent entry
      const hasRecentEntry = validEntries.some(entry => entry.gameId === game.id);
      setShowLibraryNewBadge(hasRecentEntry);
    };

    checkLibraryNewBadge();
    
    // Set up an interval to check every 10 seconds
    const interval = setInterval(checkLibraryNewBadge, 10000);
    
    return () => clearInterval(interval);
  }, [game.id]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (user.isAuthenticated && user.userId && user.token) {
      try {
        if (!isWishlisted) {
          await addToWishlist(user.userId, game.id, user.token);
          setIsWishlisted(true);
          console.log('[DEBUG] Added to wishlist:', game.title);
        } else {
          await removeFromWishlist(user.userId, game.id, user.token);
          setIsWishlisted(false);
          console.log('[DEBUG] Removed from wishlist:', game.title);
        }
      } catch (err) {
        console.error('[DEBUG] Wishlist error:', err);
      }
    } else {
      console.log('[DEBUG] User not authenticated or missing data');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!game.id) {
      console.warn('Tried to add to cart but game.id is missing:', game);
      return;
    }
    if (isUserLoggedIn && user.userId && user.token) {
      try {
        if (!isInCart) {
          await addToCart(user.userId, game.id, user.token);
          setIsInCart(true);
          console.log('[DEBUG] Added to cart:', game.title);
          
          // Trigger a custom event to update cart badge
          window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { gameId: game.id, action: 'add' } 
          }));
          
        } else {
          await removeFromCart(user.userId, game.id, user.token);
          setIsInCart(false);
          console.log('[DEBUG] Removed from cart:', game.title);
          
          // Trigger a custom event to update cart badge
          window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { gameId: game.id, action: 'remove' } 
          }));
        }
      } catch (error) {
        // If it's already in cart, just update the state
        if (error.message && error.message.includes('already in cart')) {
          setIsInCart(true);
          console.log('[DEBUG] Game already in cart, updating state:', game.title);
        } else {
          console.error('[DEBUG] Cart error:', error);
        }
      }
    } else {
      console.log('[DEBUG] User not authenticated or missing data');
    }
  };

  const handleAddToLibrary = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUserLoggedIn && user.userId && user.token) {
      try {
        await addToLibrary(user.userId, game.id, user.token);
        setIsInLibrary(true);
        
        // Store the timestamp when game was added to library for "NEW" badge
        const recentlyAddedToLibrary = JSON.parse(localStorage.getItem('recentlyAddedToLibrary') || '[]');
        const newEntry = {
          gameId: game.id,
          addedDate: Date.now()
        };
        
        // Remove any existing entry for this game and add the new one
        const filteredEntries = recentlyAddedToLibrary.filter(entry => entry.gameId !== game.id);
        filteredEntries.push(newEntry);
        
        localStorage.setItem('recentlyAddedToLibrary', JSON.stringify(filteredEntries));
        
        console.log('[DEBUG] Added to library with NEW badge:', game.title);
      } catch (err) {
        console.error('[DEBUG] Add to library error:', err);
      }
    }
  };

  const handlePlayGame = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Playing game:', game.title);
  };

  const handleDownloadGame = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInLibrary && (game.status === "Free" || game.price === 0 || game.price === "0" || game.price === "0.00")) {
      return;
    }
    const gameFileName = `${game.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_details.json`;
    const fileContent = JSON.stringify({
      title: game.title,
      description: game.description,
      price: getCurrentPrice(),
      status: game.status,
      id: game.id
    }, null, 2);
    const blob = new Blob([fileContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = gameFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log('Downloaded game details:', game.title);
  };

  const handleMoveToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUserLoggedIn && user.userId && user.token) {
      try {
        // If already in cart, just show message
        if (isInCart) {
          console.log('Game already in cart:', game.title);
          return;
        }
        
        await addToCart(user.userId, game.id, user.token);
        setIsInCart(true);
        console.log('Added game to cart:', game.title);
        
        // Trigger a custom event to update cart badge
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { gameId: game.id, action: 'add' } 
        }));
        
        // Remove from wishlist after successfully adding to cart
        try {
          await removeFromWishlist(user.userId, game.id, user.token);
          setIsWishlisted(false);
          console.log('Removed from wishlist after moving to cart:', game.title);
          
          // Trigger a custom event to notify wishlist components
          window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
            detail: { gameId: game.id, action: 'remove' } 
          }));
        } catch (wishlistError) {
          console.error('Failed to remove from wishlist after moving to cart:', wishlistError);
          // Don't throw error here as the cart operation was successful
        }
        
      } catch (error) {
        // If it's already in cart, just update the state
        if (error.message && error.message.includes('already in cart')) {
          setIsInCart(true);
          console.log('Game already in cart:', game.title);
        } else {
          console.error('Failed to add to cart:', error);
        }
      }
    } else {
      console.log('[DEBUG] User not authenticated or missing data');
    }
  };

  const handleRemoveFromWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user.isAuthenticated && user.userId && user.token) {
      try {
        await removeFromWishlist(user.userId, game.id, user.token);
        setIsWishlisted(false);
        console.log('Removed from wishlist:', game.title);
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
          detail: { gameId: game.id, action: 'remove' } 
        }));
      } catch (err) {
        console.error('Remove from wishlist error:', err);
      }
    }
  };

  const getPlatformIcon = (platform) => {
    if (!platform) return '🎮';
    
    const icons = {
      windows: 'Windows',
      linux: 'Linux',
      ios: 'ios',
      mac: 'Mac',
      android: 'android'
    };
    return icons[platform.toLowerCase()] || '🎮';
  };

  const getCurrentPrice = () => {
    if (game.status === "Free" || game.price === 0 || game.price === "0" || game.price === "0.00") {
      return "0.00";
    }
    
    if (game.discount && game.discount > 0 && game.original_price) {
      const originalPrice = typeof game.original_price === 'string' 
        ? parseFloat(game.original_price) 
        : game.original_price;
      return ((originalPrice * (100 - game.discount)) / 100).toFixed(2);
    }
    
    const price = typeof game.price === 'string' ? parseFloat(game.price) : game.price || 0;
    return price.toFixed(2);
  };


  const renderPlatformBadges = () => {
    const platforms = typeof game.platform === 'string' 
      ? game.platform.split(', ') 
      : Array.isArray(game.platform) 
        ? game.platform 
        : [];
    
    return (
      <div className="platform-badges">
        {platforms.map((platform, index) => (
          <span key={index} className="platform-badge" title={platform}>
            {getPlatformIcon(platform)}
          </span>
        ))}
      </div>
    );
  };

  const renderDiscountBadge = () => {
    const discountPercentage = game.discount || 0;
    return discountPercentage > 0 ? (
      <div className="discount-badge">
        -{discountPercentage}%
      </div>
    ) : null;
  };

  const renderPrice = () => {
    if (game.status === "Free" || game.price === 0 || game.price === "0" || game.price === "0.00") {
      return (
        <div className="game-card-price">
          <span className="free-price">Free</span>
        </div>
      );
    }
    
    return (
      <div className="game-card-price">
        {game.discount && game.original_price ? (
          <>
            <span className="original-price">${typeof game.original_price === 'string' 
              ? parseFloat(game.original_price).toFixed(2) 
              : game.original_price.toFixed(2)}</span>
            <span className="discounted-price">${getCurrentPrice()}</span>
          </>
        ) : (
          <span className="current-price">${getCurrentPrice()}</span>
        )}
      </div>
    );
  };

  const renderStandardActions = () => (
    <div className="game-card-actions">
      {isUserLoggedIn ? (
        <button 
          className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlistToggle}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FaRegHeart />
        </button>
      ) : (
        <button 
          className="wishlist-btn disabled"
          title="Please login to add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Please login to add to wishlist');
          }}
        >
          <FaRegHeart />
        </button>
      )}
      {game.status === "Free" || game.price === 0 || game.price === "0" || game.price === "0.00" ? (
        isInLibrary ? (
          <button 
            className="add-to-cart-btn free-game" 
            onClick={handleDownloadGame} 
            title="Download Game"
          >
            <IoDownloadOutline />
          </button>
        ) : (
          <button 
            className="add-to-cart-btn free-game" 
            onClick={async (e) => { await handleAddToLibrary(e); setTimeout(() => handleDownloadGame(e), 500); }} 
            title="Add to Library"
          >
            <IoDownloadOutline />
          </button>
        )
      ) : (
        <button 
          className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`} 
          onClick={handleAddToCart} 
          title={isInCart ? 'Remove from Cart' : 'Add to Cart'}
        >
          <IoCartOutline />
        </button>
      )}
    </div>
  );

  const renderWishlistCard = () => (
    <div className="game-card game-card-horizontal">
      <div className="row g-0 h-100">
        <div className="col-md-4">
          <div className="game-card-image-container">
            <img 
              src={game.image_url} 
              alt={game.title}
              className="game-card-image"
            />
            {renderPlatformBadges()}
            {renderDiscountBadge()}
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="game-card-content">
            <div className="content-top">
              <h5 className="game-card-title">{game.title}</h5>
              <p className="game-card-description">{game.description}</p>
            </div>
            
            <div className="game-card-footer">
              {renderPrice()}
              
              <div className="game-card-actions">
                <button 
                  className="wishlist-action-btn move-to-cart-btn"
                  onClick={handleMoveToCart}
                  title="Move to Cart"
                >
                  <IoCartOutline />
                  Move to Cart
                </button>
                
                <Link 
                  to={`/gameinfo/${game.id}`} 
                  className="wishlist-action-btn more-info-btn"
                  title="More Info"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaRegEye />
                  More Info
                </Link>
                
                <button 
                  className="wishlist-action-btn remove-btn"
                  onClick={handleRemoveFromWishlist}
                  title="Remove from Wishlist"
                >
                  <IoHeartDislikeOutline />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLibraryCard = () => (
    <div className="game-card game-card-horizontal">
      <div className="row g-0 h-100">
        <div className="col-md-4">
          <div className="game-card-image-container">
            <img 
              src={game.image_url} 
              alt={game.title}
              className="game-card-image"
            />
            {renderPlatformBadges()}
            {showNewBadge && (
              <div className="new-badge">
                <span>NEW</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="game-card-content">
            <div className="content-top">
              <h5 className="game-card-title">{game.title}</h5>
              <p className="game-card-description">{game.description}</p>
            </div>
            
            <div className="game-card-footer">
              
              <div className="game-card-actions">
                <button 
                  className="library-action-btn play-btn"
                  onClick={handlePlayGame}
                  title="Play Game"
                >
                  <IoPlayOutline />
                  Play
                </button>
                
                <button 
                  className="library-action-btn download-btn"
                  onClick={handleDownloadGame}
                  title="Download Game"
                >
                  <IoDownloadOutline />
                  Download
                </button>
                
                <Link 
                  to={`/gameinfo/${game.id}`} 
                  className="library-action-btn info-btn"
                  title="Game Info"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaRegEye />
                  Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturedCard = () => (
    <Link to={`/gameinfo/${game.id}`} className="game-card-link">
      <div className="game-card game-card-featured">
        <div className="game-card-image-container">
          <img 
            src={game.image_url} 
            alt={game.title}
            className="game-card-image"
          />
          {renderPlatformBadges()}
          {renderDiscountBadge()}
          {showLibraryNewBadge && (
            <div className="new-badge library-new">
              <span>NEW</span>
            </div>
          )}
        </div>

        <div className="game-card-content">
          <h5 className="game-card-title">{game.title}</h5>
          <p className="game-card-description">{game.description}</p>
          
          <div className="game-card-footer">
            {renderPrice()}
            {renderStandardActions()}
          </div>
        </div>
      </div>
    </Link>
  );

  const renderNewReleaseCard = () => (
    <Link to={`/gameinfo/${game.id}`} className="game-card-link">
      <div className="game-card game-card-new-release">
        <div className="game-card-image-container">
          <img 
            src={game.image_url} 
            alt={game.title}
            className="game-card-image"
          />
          {renderPlatformBadges()}
          {renderDiscountBadge()}
          {showLibraryNewBadge && (
            <div className="new-badge library-new">
              <span>NEW</span>
            </div>
          )}
        </div>

        <div className="game-card-content">
          <h6 className="game-card-title">{game.title}</h6>
          <p className="game-card-description">{game.description}</p>
          
          <div className="game-card-footer">
            {renderPrice()}
            {renderStandardActions()}
          </div>
        </div>
      </div>
    </Link>
  );

  const renderHorizontalCard = () => (
    <Link to={`/gameinfo/${game.id}`} className="game-card-link">
      <div className="game-card game-card-horizontal">
        <div className="row g-0 h-100">
          <div className="col-md-4">
            <div className="game-card-image-container">
              <img 
                src={game.image_url} 
                alt={game.title}
                className="game-card-image"
              />
              {renderPlatformBadges()}
              {renderDiscountBadge()}
              {showLibraryNewBadge && (
                <div className="new-badge library-new">
                  <span>NEW</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="col-md-8">
            <div className="game-card-content">
              <div className="content-top">
                <h5 className="game-card-title">{game.title}</h5>
                <p className="game-card-description">{game.description}</p>
              </div>
              
              <div className="game-card-footer">
                {renderPrice()}
                {renderStandardActions()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  switch (cardType) {
    case 'wishlist':
      return renderWishlistCard();
    case 'library':
      return renderLibraryCard();
    case 'new-release':
      return renderNewReleaseCard();
    case 'horizontal':
      return renderHorizontalCard();
    case 'featured':
    default:
      return renderFeaturedCard();
  }
}

export default GameCard;