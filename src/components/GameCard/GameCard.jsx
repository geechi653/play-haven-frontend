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
  isUserLoggedIn = false 
}) {
  const { store } = useGlobalStore();
  const user = store.user;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(game.isInLibrary || false);
  const navigate = useNavigate();

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
    if (isUserLoggedIn && user.userId) {
      try {
        if (!isInCart) {
          await addToCart(user.userId, game.id, user.token);
          setIsInCart(true);
        } else {
          await removeFromCart(user.userId, game.id);
          setIsInCart(false);
        }
      } catch (error) {
        console.error('Failed to update cart:', error);
      }
    }
  };

  const handleAddToLibrary = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUserLoggedIn && user.userId && user.token) {
      try {
        await addToLibrary(user.userId, game.id, user.token);
        setIsInLibrary(true);
      } catch (err) {
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
    
    if (isUserLoggedIn && user.userId) {
      try {
        await addToCart(user.userId, game.id);
        setIsInCart(true);
        console.log('Moving game to cart:', game.title);
        navigate('/cart');
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
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
          <button className="download-btn" onClick={handleDownloadGame} title="Download Game">
            <IoDownloadOutline /> Download Free
          </button>
        ) : (
          <button className="add-to-library-btn" onClick={async (e) => { await handleAddToLibrary(e); setTimeout(() => handleDownloadGame(e), 500); }} title="Add to Library and Download">
            <span className="add-to-library-icon">+</span> Add to Library
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
    case 'featured':
    default:
      return renderFeaturedCard();
  }
}

export default GameCard;