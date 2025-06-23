import { useState, useEffect } from 'react';
import GameCard from '../../components/GameCard/GameCard.jsx';
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

  useEffect(() => {
    const handleWishlistUpdate = (event) => {
      const { gameId, action } = event.detail;
      if (action === 'remove') {
        setRemovedGames(prev => new Set([...prev, gameId]));
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  // Get user's wishlist games (games that have been wishlisted)
  // Expected user.wishlist structure: [gameId1, gameId2, gameId3, ...]
  // This array gets populated when user clicks the heart/wishlist button on game cards
  const wishlistGames = games.allGames.filter(game => 
    user.isAuthenticated && 
    user.wishlist && 
    user.wishlist.includes(game.id) &&
    !removedGames.has(game.id)
  );

  // Show wishlisted games only - if no games wishlisted, show empty state
  const displayGames = wishlistGames;

  // Filter and search logic
  const filteredGames = displayGames.filter(game => {
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
  const allGenres = [...new Set(displayGames.flatMap(game => game.genres || []))];
  const allPlatforms = [...new Set(displayGames.flatMap(game => game.platform || []))];

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

        <div className="wishlist-games">
          {!user.isAuthenticated ? (
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
                    isUserLoggedIn={user.isAuthenticated}
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