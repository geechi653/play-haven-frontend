import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGameDetails, addToCart, downloadGame } from '../../utils/api.js';
import { useGlobalStore } from '../../hooks/useGlobalStore';
import './GameInfo.css';

function GameInfo() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { store } = useGlobalStore();
  const user = store.user;
  const wishlist = store.wishlist.items;
  const isUserLoggedIn = user.isAuthenticated;
  const isWishlisted = wishlist.includes(Number(gameId));

  const handleDownloadGame = async () => {
    if (!game) return;
    
    // Check authentication first - if not logged in, show login modal
    if (!isUserLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    try {
      // Call the secure download API
      const gameData = await downloadGame(game.id, user.userId);
      
      // Create a blob with game data to simulate a download
      const downloadInfo = {
        name: game.title,
        platform: game.platform,
        id: game.id,
        downloadedAt: new Date().toISOString(),
        downloadDetails: gameData.download_info
      };
      
      const blob = new Blob([JSON.stringify(downloadInfo, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set up download attributes
      link.href = url;
      link.download = `${game.title.replace(/[^a-zA-Z0-9]/g, '_')}_install.json`;
      document.body.appendChild(link);
      
      // Trigger download and clean up
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show a success message or trigger additional actions
      alert(`Download started for ${game.title}. Check your downloads folder.`);
    } catch (error) {
      console.error('Error downloading game:', error);
      if (error.message.includes('Authentication required')) {
        setShowLoginModal(true);
      } else {
        alert('Failed to download game. Please try again later.');
      }
    }
  };

  const handleAddToCart = async () => {
    if (!isUserLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    // For free games, trigger download directly
    if (game.status === "Free" || parseFloat(game.price) === 0) {
      handleDownloadGame();
      return;
    }
    
    try {
      // Add to cart through API
      const response = await addToCart(game.id, user.userId);
      
      // Show success message
      alert(`${game.title} has been added to your cart.`);
      
      // If we wanted to update the cart state immediately, we could do so here
      // This would typically be handled by a global state manager like Redux
    } catch (error) {
      console.error('Error adding game to cart:', error);
      alert('Failed to add game to cart. Please try again.');
    }
  };
  
  const handleBuyNow = async () => {
    if (!isUserLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    // For free games, download directly
    if (game.status === "Free" || parseFloat(game.price) === 0) {
      await handleDownloadGame();
      return;
    }
    
    try {
      // Add to cart first
      await addToCart(game.id, user.userId);
      
      // Redirect to checkout page
      navigate('/cart');
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      alert('Failed to proceed to checkout. Please try again.');
    }
  };
  
  const closeLoginModal = () => {
    setShowLoginModal(false);
  };
  
  const goToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    const loadGameDetails = async () => {
      try {
        setLoading(true);
        const gameData = await fetchGameDetails(gameId);
        setGame(gameData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading game details:', err);
        setError('Failed to load game details. Please try again later.');
        setLoading(false);
      }
    };

    if (gameId) {
      loadGameDetails();
    }
  }, [gameId]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading game details...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error || 'Game not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="game-info-page">
      <div className="container py-5">
        <div className="row">
          {/* Game Image */}
          <div className="col-lg-5 mb-4 mb-lg-0">
            <div className="game-image-container">
              <img 
                src={game.image_url} 
                alt={game.title}
                className="img-fluid rounded shadow"
              />
            </div>
            
            {/* Game Actions */}
            <div className="game-actions mt-4 d-flex flex-wrap gap-2">
              <button 
                className="btn btn-primary btn-lg"
                onClick={handleBuyNow}
              >
                {game.status === "Free" || parseFloat(game.price) === 0 
                  ? "Download Now - Free" 
                  : `Buy Now - $${parseFloat(game.price).toFixed(2)}`
                }
              </button>
              
              {!(game.status === "Free" || parseFloat(game.price) === 0) && (
                <button 
                  className="btn btn-outline-primary btn-lg"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              )}
              
              {isUserLoggedIn && (
                <button className={`btn ${isWishlisted ? 'btn-danger' : 'btn-outline-secondary'} btn-lg`}>
                  {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              )}
            </div>
          </div>
          
          {/* Game Details */}
          <div className="col-lg-7">
            <h1 className="game-title">{game.title}</h1>
            
            <div className="game-meta mb-4">
              {game.category && game.category.split(', ').map((cat, index) => (
                <span key={index} className="badge bg-primary">{cat}</span>
              ))}
              
              {typeof game.platform === 'string' && game.platform.split(', ').map((platform, index) => (
                <span key={`platform-${index}`} className="badge bg-secondary">{platform}</span>
              ))}
              
              {Array.isArray(game.platform) && game.platform.map((platform, index) => (
                <span key={`platform-array-${index}`} className="badge bg-secondary">{platform}</span>
              ))}
              
              <span className="badge bg-info">{game.release_year}</span>
              
              {game.rating && (
                <span className="badge bg-warning text-dark">
                  Rating: {game.rating}/10
                </span>
              )}
            </div>
            
            <div className="game-description mb-4">
              <h4>Description</h4>
              <div className="description-content">
                {game.description.split('\n').map((paragraph, i) => (
                  paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
                ))}
              </div>
            </div>
            
            <div className="game-details">
              <h4>Details</h4>
              <table className="table">
                <tbody>
                  <tr>
                    <th>Release Year</th>
                    <td>{game.release_year}</td>
                  </tr>
                  <tr>
                    <th>Platform</th>
                    <td>{typeof game.platform === 'string' ? game.platform : Array.isArray(game.platform) ? game.platform.join(', ') : 'Unknown Platform'}</td>
                  </tr>
                  <tr>
                    <th>Category</th>
                    <td>{game.category}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{game.status}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      {showLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            <h4>Authentication Required</h4>
            <p>You need to be logged in to {game && game.status === "Free" ? "download this game" : "add this game to your cart"}.</p>
            <div className="login-modal-buttons">
              <button 
                className="btn btn-primary"
                onClick={goToLogin}
              >
                Go to Login
              </button>
              <button 
                className="btn btn-secondary"
                onClick={closeLoginModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameInfo;
