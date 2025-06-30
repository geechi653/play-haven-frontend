import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { IoCartOutline, IoPlayOutline, IoDownloadOutline, IoHeartDislikeOutline } from "react-icons/io5";
import { FaRegHeart, FaRegEye } from "react-icons/fa6";
import { addGameToWishlist, removeGameFromWishlist, addGameToCart, removeGameFromCart } from '../../utils/api.js';
import './GameCard.css';

function GameCard({ 
  game, 
  cardType = 'featured',
  isUserLoggedIn = false,
  userId = null,
  isWishlisted = false,
  isInCart = false,
  onWishlistChange = () => {},
  onCartChange = () => {}
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isUserLoggedIn || !userId) {
      alert('Please log in to add games to your wishlist');
      return;
    }

    setLoading(true);
    try {
      if (isWishlisted) {
        await removeGameFromWishlist(userId, game.id);
      } else {
        await addGameToWishlist(userId, game.id);
      }
      onWishlistChange(game.id, !isWishlisted);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      alert('Please log in to add games to your cart');
      return;
    }

    setLoading(true);
    try {
      if (isInCart) {
        await removeGameFromCart(userId, game.id);
      } else {
        await addGameToCart(userId, game.id);
      }
      onCartChange(game.id, !isInCart);
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // game launch logic is here (we are not implementing that though)
    console.log('Playing game:', game.title);
  };

  const handleDownloadGame = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Creates and downloads a dummy text file
    const gameFileName = `${game.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_installer.txt`;
    const fileContent = `Game Installer for ${game.title}\n\nDownload initiated on: ${new Date().toLocaleString()}\n\nThis is a dummy download file for demonstration purposes.\n\nGame Details:\n- Title: ${game.title}\n- Description: ${game.description}\n- Price: $${getCurrentPrice()}\n\nThank you for choosing Play Heaven!`;
    
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = gameFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('Downloaded game installer:', game.title);
  };

  const handleMoveToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      alert('Please log in to add games to your cart');
      return;
    }

    setLoading(true);
    try {
      // Add to cart
      await addGameToCart(userId, game.id);
      // Remove from wishlist (since it's being moved to cart)
      if (isWishlisted) {
        await removeGameFromWishlist(userId, game.id);
      }
      
      console.log('Moving game to cart:', game.title);
      navigate('/cart');
    } catch (error) {
      console.error('Error moving to cart:', error);
      alert('Failed to move game to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isUserLoggedIn || !userId) return;

    setLoading(true);
    try {
      await removeGameFromWishlist(userId, game.id);
      onWishlistChange(game.id, false);
      console.log('Removing from wishlist:', game.title);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove from wishlist. Please try again.');
    } finally {
      setLoading(false);
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
    // Check if the game is free
    if (game.status === "Free" || game.price === 0 || game.price === "0" || game.price === "0.00") {
      return "0.00";
    }
    
    // If there's a discount and original price, calculate the discounted price
    if (game.discount && game.discount > 0 && game.original_price) {
      const originalPrice = typeof game.original_price === 'string' 
        ? parseFloat(game.original_price) 
        : game.original_price;
      return ((originalPrice * (100 - game.discount)) / 100).toFixed(2);
    }
    
    // Otherwise return the regular price or 0 if price is not available
    // Ensure price is treated as a number and not a string
    const price = typeof game.price === 'string' ? parseFloat(game.price) : game.price || 0;
    return price.toFixed(2);
  };

  // Shared Components
  const renderPlatformBadges = () => {
    // Handle platform as a string (e.g., "Windows, Mac") or as an array
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
    // Check if there's a valid discount percentage
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
      {isUserLoggedIn && (
        <button 
          className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''} ${loading ? 'loading' : ''}`}
          onClick={handleWishlistToggle}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          disabled={loading}
        >
          <FaRegHeart />
        </button>
      )}
      <button 
        className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''} ${loading ? 'loading' : ''}`} 
        onClick={handleAddToCart} 
        title={isInCart ? 'Remove from Cart' : 'Add to Cart'}
        disabled={loading}
      >
        <IoCartOutline />
      </button>
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
                  className={`wishlist-action-btn move-to-cart-btn ${loading ? 'loading' : ''}`}
                  onClick={handleMoveToCart}
                  title="Move to Cart"
                  disabled={loading}
                >
                  <IoCartOutline />
                  {loading ? 'Moving...' : 'Move to Cart'}
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
                  className={`wishlist-action-btn remove-btn ${loading ? 'loading' : ''}`}
                  onClick={handleRemoveFromWishlist}
                  title="Remove from Wishlist"
                  disabled={loading}
                >
                  <IoHeartDislikeOutline />
                  {loading ? 'Removing...' : 'Remove'}
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
    case 'store':
      return renderFeaturedCard();
    case 'featured':
    default:
      return renderFeaturedCard();
  }
}

export default GameCard;