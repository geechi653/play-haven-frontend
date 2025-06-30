import { useState, useEffect } from 'react';
import GameCard from '../../components/GameCard/GameCard.jsx';
import { getWishlist, getCart } from '../../utils/api.js';
import { initialState } from '../../store/initialStore.js';
import './Wishlist.css';

function Wishlist() {
  const storeData = initialState();
  const { games, user } = storeData;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [removedGames, setRemovedGames] = useState(new Set());
  
  // User state management
  const [userWishlist, setUserWishlist] = useState([]);
  const [userCart, setUserCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isUserLoggedIn = user.isAuthenticated;
  const userId = user.userId;

  // Load user's wishlist and cart with better error handling
  useEffect(() => {
    const loadUserData = async () => {
      console.log('Loading wishlist data...', { isUserLoggedIn, userId });
      
      if (!isUserLoggedIn || !userId) {
        console.log('User not logged in or no userId, using fallback data');
        setUserWishlist(user.wishlist || []);
        setUserCart(user.cart || []);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Attempting to fetch wishlist and cart from API...');
        
        // Add timeout to prevent infinite loading
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );

        const wishlistPromise = getWishlist(userId);
        const cartPromise = getCart(userId);

        const [wishlist, cart] = await Promise.race([
          Promise.all([wishlistPromise, cartPromise]),
          timeout
        ]);

        console.log('API Response:', { wishlist, cart });

        setUserWishlist(Array.isArray(wishlist) ? wishlist : []);
        setUserCart(Array.isArray(cart) ? cart : []);
        
      } catch (error) {
        console.error('Error loading user data from API:', error);
        setError(error.message);
        
        // Fallback to initialState data
        console.log('Using fallback data from initialState');
        setUserWishlist(user.wishlist || []);
        setUserCart(user.cart || []);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isUserLoggedIn, userId, user.wishlist, user.cart]);

  // Listen for wishlist and cart updates from other components
  useEffect(() => {
    const handleWishlistUpdate = (event) => {
      console.log('Wishlist update event:', event.detail);
      const { gameId, action, userId: eventUserId } = event.detail;
      
      if (eventUserId === userId || !userId) {
        if (action === 'add') {
          setUserWishlist(prev => [...prev, gameId]);
          setRemovedGames(prev => {
            const newSet = new Set(prev);
            newSet.delete(gameId);
            return newSet;
          });
        } else if (action === 'remove') {
          setUserWishlist(prev => prev.filter(id => id !== gameId));
          setRemovedGames(prev => new Set([...prev, gameId]));
        }
      }
    };

    const handleCartUpdate = (event) => {
      console.log('Cart update event:', event.detail);
      const { gameId, action, userId: eventUserId } = event.detail;
      
      if (eventUserId === userId || !userId) {
        if (action === 'add') {
          setUserCart(prev => [...prev, gameId]);
        } else if (action === 'remove') {
          setUserCart(prev => prev.filter(id => id !== gameId));
        } else if (action === 'clear') {
          setUserCart([]);
        }
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [userId]);

  // Get user's wishlist games (games that have been wishlisted)
  const wishlistGames = games.allGames.filter(game => 
    userWishlist.includes(game.id) && !removedGames.has(game.id)
  );

  // Filter and search logic
  const filteredGames = wishlistGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre === 'all' || 
                        (game.genres && game.genres.includes(selectedGenre));
    
    const matchesPlatform = selectedPlatform === 'all' || 
                           game.platform.some(p => p.toLowerCase() === selectedPlatform.toLowerCase());
    
    return matchesSearch && matchesGenre && matchesPlatform;
  });

  // Sort games
  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'recent':
        return new Date(b.release_date || '2024-01-01') - new Date(a.release_date || '2024-01-01');
      case 'price_low':
        return parseFloat(a.price || 0) - parseFloat(b.price || 0);
      case 'price_high':
        return parseFloat(b.price || 0) - parseFloat(a.price || 0);
      default:
        return 0;
    }
  });

  // Get unique genres and platforms for filters
  const allGenres = [...new Set(wishlistGames.flatMap(game => game.genres || []))];
  const allPlatforms = [...new Set(wishlistGames.flatMap(game => game.platform || []))];

  // Handle wishlist changes from GameCard
  const handleWishlistChange = (gameId, isWishlisted) => {
    console.log('Wishlist change:', { gameId, isWishlisted });
    if (isWishlisted) {
      setUserWishlist(prev => [...prev, gameId]);
      setRemovedGames(prev => {
        const newSet = new Set(prev);
        newSet.delete(gameId);
        return newSet;
      });
    } else {
      setUserWishlist(prev => prev.filter(id => id !== gameId));
      setRemovedGames(prev => new Set([...prev, gameId]));
    }
  };

  // Handle cart changes from GameCard
  const handleCartChange = (gameId, isInCart) => {
    console.log('Cart change:', { gameId, isInCart });
    if (isInCart) {
      setUserCart(prev => [...prev, gameId]);
    } else {
      setUserCart(prev => prev.filter(id => id !== gameId));
    }
  };

  // Debug function to clear loading state manually
  const handleForceLoad = () => {
    console.log('Force loading complete with current data');
    setLoading(false);
    setError(null);
    // Use initialState data as fallback
    setUserWishlist(user.wishlist || []);
    setUserCart(user.cart || []);
  };

  // Loading state with timeout
  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="wishlist-header">
            <h1 className="wishlist-title">Your Wishlist</h1>
            <p className="wishlist-subtitle">Loading your wishlist...</p>
          </div>
          
          {/* Debug info and manual override */}
          <div className="loading-debug" style={{ 
            padding: '1rem', 
            background: 'rgba(59, 130, 246, 0.1)', 
            borderRadius: '8px', 
            marginBottom: '2rem' 
          }}>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Debug Info: {isUserLoggedIn ? `User ${userId} logged in` : 'User not logged in'}
              {error && ` | Error: ${error}`}
            </p>
            <button 
              onClick={handleForceLoad}
              className="btn btn-outline-primary btn-sm"
            >
              Skip Loading & Use Demo Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="wishlist-header">
            <h1 className="wishlist-title">Your Wishlist</h1>
            <p className="wishlist-subtitle">Error loading wishlist</p>
          </div>
          
          <div className="error-message" style={{ 
            padding: '2rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            borderRadius: '8px', 
            textAlign: 'center' 
          }}>
            <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>
              Unable to Load Wishlist
            </h3>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              {error}
            </p>
            <button 
              onClick={handleForceLoad}
              className="btn btn-primary"
            >
              Use Demo Data Instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1 className="wishlist-title">Your Wishlist</h1>
          <p className="wishlist-subtitle">
            {sortedGames.length} game{sortedGames.length !== 1 ? 's' : ''} on your wishlist
          </p>
        </div>

        <div className="wishlist-controls">
          <div className="row g-3 align-items-end">
            {/* Search Bar */}
            <div className="col-md-4">
              <label htmlFor="search" className="form-label">Search Games</label>
              <input
                type="text"
                id="search"
                className="form-control wishlist-search"
                placeholder="Search your wishlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label htmlFor="genre" className="form-label">Genre</label>
              <select
                id="genre"
                className="form-select wishlist-filter"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="all">All Genres</option>
                {allGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label htmlFor="platform" className="form-label">Platform</label>
              <select
                id="platform"
                className="form-select wishlist-filter"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="all">All Platforms</option>
                {allPlatforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label htmlFor="sort" className="form-label">Sort By</label>
              <select
                id="sort"
                className="form-select wishlist-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Recently Added</option>
                <option value="alphabetical">A-Z</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('all');
                  setSelectedPlatform('all');
                  setSortBy('recent');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Debug info */}
        <div className="user-status-debug mb-3" style={{ opacity: 0.7, fontSize: '0.9rem' }}>
          <small>
            Debug: Wishlist {userWishlist.length} items | Cart {userCart.length} items | 
            User: {isUserLoggedIn ? `${userId} (logged in)` : 'not logged in'} |
            Games found: {wishlistGames.length}
          </small>
        </div>

        <div className="wishlist-games">
          {!isUserLoggedIn ? (
            <div className="no-games-message">
              <div className="no-games-content">
                <h3>Please Log In</h3>
                <p>
                  You need to be logged in to view your wishlist. 
                  Please log in to see your saved games.
                </p>
                <a href="/login" className="btn btn-primary">
                  Log In
                </a>
              </div>
            </div>
          ) : sortedGames.length > 0 ? (
            <div className="games-list">
              {sortedGames.map(game => (
                <div key={game.id} className="wishlist-game-item">
                  <GameCard 
                    game={game} 
                    cardType="wishlist" 
                    isUserLoggedIn={isUserLoggedIn}
                    userId={userId}
                    isWishlisted={true} // Always true in wishlist
                    isInCart={userCart.includes(game.id)}
                    onWishlistChange={handleWishlistChange}
                    onCartChange={handleCartChange}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-games-message">
              <div className="no-games-content">
                <h3>Your Wishlist is Empty</h3>
                <p>
                  You haven't added any games to your wishlist yet. Browse our store to find amazing games 
                  and save them to your wishlist for later!
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <a href="/store" className="btn btn-primary">
                    Browse Store
                  </a>
                  <a href="/home" className="btn btn-outline-primary">
                    View Featured Games
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;