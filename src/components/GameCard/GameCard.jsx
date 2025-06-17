import { useState } from 'react';
import { Link } from "react-router";
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import './GameCard.css';

function GameCard({ 
  game, 
  cardType = 'featured',
  isUserLoggedIn = false 
}) {
  const [isWishlisted, setIsWishlisted] = useState(game.isWishlisted || false);
  const [isInCart, setIsInCart] = useState(false);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUserLoggedIn) {
      setIsWishlisted(!isWishlisted);
      // This is a shell call an API to update wishlist
      // TODO update call
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInCart(!isInCart); 
    
    // This is shell call an API to add/remove from cart
    // TODO update it here
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

  // Calculate discounted price if discount exists
  const currentPrice = game.discount && game.original_price 
    ? (parseFloat(game.original_price) * (100 - game.discount) / 100).toFixed(2)
    : parseFloat(game.price).toFixed(2);

  const renderFeaturedCard = () => (
    <Link to="/gameInfo" className="game-card-link">
      <div className="game-card game-card-featured">
        <div className="game-card-image-container">
          <img 
            src={game.image_url} 
            alt={game.title}
            className="game-card-image"
          />
          
          <div className="platform-badges">
            {game.platform.map((platform, index) => (
              <span key={index} className="platform-badge" title={platform}>
                {getPlatformIcon(platform)}
              </span>
            ))}
          </div>

          {/* Discount badge */}
          {game.discount && (
            <div className="discount-badge">
              -{game.discount}%
            </div>
          )}
        </div>

        <div className="game-card-content">
          <h5 className="game-card-title">{game.title}</h5>
          <p className="game-card-description">{game.description}</p>
          
          <div className="game-card-footer">
            <div className="game-card-price">
              {game.discount && game.original_price ? (
                <>
                  <span className="original-price">${parseFloat(game.original_price).toFixed(2)}</span>
                  <span className="discounted-price">${currentPrice}</span>
                </>
              ) : (
                <span className="current-price">${parseFloat(game.price).toFixed(2)}</span>
              )}
            </div>
            
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
          </div>
        </div>
      </div>
    </Link>
  );

  const renderNewReleaseCard = () => (
    <Link to="/gameInfo" className="game-card-link">
      <div className="game-card game-card-new-release">
        <div className="game-card-image-container">
          <img 
            src={game.image_url} 
            alt={game.title}
            className="game-card-image"
          />
          
          {/* Platform badges */}
          <div className="platform-badges">
            {game.platform.map((platform, index) => (
              <span key={index} className="platform-badge" title={platform}>
                {getPlatformIcon(platform)}
              </span>
            ))}
          </div>

          {/* Discount badge */}
          {game.discount && (
            <div className="discount-badge">
              -{game.discount}%
            </div>
          )}
        </div>

        <div className="game-card-content">
          <h6 className="game-card-title">{game.title}</h6>
          <p className="game-card-description">{game.description}</p>
          
          <div className="game-card-footer">
            <div className="game-card-price">
              {game.discount && game.original_price ? (
                <>
                  <span className="original-price">${parseFloat(game.original_price).toFixed(2)}</span>
                  <span className="discounted-price">${currentPrice}</span>
                </>
              ) : (
                <span className="current-price">${parseFloat(game.price).toFixed(2)}</span>
              )}
            </div>
            
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
          </div>
        </div>
      </div>
    </Link>
  );

  const renderHorizontalCard = () => (
    <Link to="/gameInfo" className="game-card-link">
      <div className="game-card game-card-horizontal">
        <div className="row g-0 h-100">
          <div className="col-md-4">
            <div className="game-card-image-container">
              <img 
                src={game.image_url} 
                alt={game.title}
                className="game-card-image"
              />
              
              {/* Platform badges */}
              <div className="platform-badges">
                {game.platform.map((platform, index) => (
                  <span key={index} className="platform-badge" title={platform}>
                    {getPlatformIcon(platform)}
                  </span>
                ))}
              </div>

              {/* Discount badge */}
              {game.discount && (
                <div className="discount-badge">
                  -{game.discount}%
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
                <div className="game-card-price">
                  {game.discount && game.original_price ? (
                    <>
                      <span className="original-price">${parseFloat(game.original_price).toFixed(2)}</span>
                      <span className="discounted-price">${currentPrice}</span>
                    </>
                  ) : (
                    <span className="current-price">${parseFloat(game.price).toFixed(2)}</span>
                  )}
                </div>
                
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  switch (cardType) {
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