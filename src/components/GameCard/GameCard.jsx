import { useState } from 'react';
import { Link, useNavigate } from "react-router";
import { IoCartOutline, IoPlayOutline, IoDownloadOutline, IoHeartDislikeOutline } from "react-icons/io5";
import { FaRegHeart, FaRegEye } from "react-icons/fa6";
import './GameCard.css';

function GameCard({ 
  game, 
  cardType = 'featured',
  isUserLoggedIn = false 
}) {
  const [isWishlisted, setIsWishlisted] = useState(game.isWishlisted || false);
  const [isInCart, setIsInCart] = useState(false);
  const navigate = useNavigate();

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUserLoggedIn) {
      setIsWishlisted(!isWishlisted);
      // TODO: API call to update wishlist
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInCart(!isInCart); 
    // TODO: API call to add/remove from cart
  };

  const handlePlayGame = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // game launch logic is hear (we are not implementing that though)
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

  const handleMoveToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Adds game to cart and navigate to cart page
    setIsInCart(true);
    // TODO: API call to add to cart
    console.log('Moving game to cart:', game.title);
    navigate('/cart');
  };

  const handleRemoveFromWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUserLoggedIn) {
      setIsWishlisted(false);
      
      // Force render by updating the parent component
      // This simulates removing the game from the user.wishlist array
      // TODO: Replace with actual API call to update user.wishlist
      const event = new CustomEvent('wishlistUpdated', { 
        detail: { gameId: game.id, action: 'remove' } 
      });
      window.dispatchEvent(event);
      
      console.log('Removing from wishlist:', game.title);
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      windows: 'windows',
      linux: 'linux',
      ios: 'ios',
      mac: 'ios',
      android: 'android'
    };
    return icons[platform.toLowerCase()] || '🎮';
  };

  const getCurrentPrice = () => {
    return game.discount && game.original_price 
      ? (parseFloat(game.original_price) * (100 - game.discount) / 100).toFixed(2)
      : parseFloat(game.price).toFixed(2);
  };

  // Shared Components
  const renderPlatformBadges = () => (
    <div className="platform-badges">
      {game.platform.map((platform, index) => (
        <span key={index} className="platform-badge" title={platform}>
          {getPlatformIcon(platform)}
        </span>
      ))}
    </div>
  );

  const renderDiscountBadge = () => (
    game.discount && (
      <div className="discount-badge">
        -{game.discount}%
      </div>
    )
  );

  const renderPrice = () => (
    <div className="game-card-price">
      {game.discount && game.original_price ? (
        <>
          <span className="original-price">${parseFloat(game.original_price).toFixed(2)}</span>
          <span className="discounted-price">${getCurrentPrice()}</span>
        </>
      ) : (
        <span className="current-price">${parseFloat(game.price).toFixed(2)}</span>
      )}
    </div>
  );

  const renderStandardActions = () => (
    <div className="game-card-actions">
      {isUserLoggedIn && (
        <button 
          className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlistToggle}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FaRegHeart />
        </button>
      )}
      <button 
        className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`} 
        onClick={handleAddToCart} 
        title={isInCart ? 'Remove from Cart' : 'Add to Cart'}
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
                  className="wishlist-action-btn move-to-cart-btn"
                  onClick={handleMoveToCart}
                  title="Move to Cart"
                >
                  <IoCartOutline />
                  Move to Cart
                </button>
                
                <Link 
                  to="/gameinfo" 
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
                  to="/gameinfo" 
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
    <Link to="/gameinfo" className="game-card-link">
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
    <Link to="/gameinfo" className="game-card-link">
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
    <Link to="/gameinfo" className="game-card-link">
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