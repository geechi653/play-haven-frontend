import { useState, useEffect } from 'react';
import { fetchTopGames, fetchDiscountedGames, searchGames } from '../../utils/api.js';
import GameCard from '../../components/GameCard/GameCard.jsx';
import { useGlobalStore } from '../../hooks/useGlobalStore';
import './Store.css';

function Store() {
  const [games, setGames] = useState([]); // All loaded games
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1); // Track which page we're on
  const [hasMoreGames, setHasMoreGames] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleGames, setVisibleGames] = useState([]);
  const GAMES_PER_PAGE = 20;
  const MAX_GAMES = 50;

  const { store } = useGlobalStore();
  const user = store.user;
  const wishlist = store.wishlist.items;
  const isUserLoggedIn = user.isAuthenticated;

  // Fetch games in pages
  const fetchGamesPage = async (pageNum) => {
    setLoadingMore(true);
    try {
      const offset = (pageNum - 1) * GAMES_PER_PAGE;
      const newGames = await fetchTopGames(GAMES_PER_PAGE, offset);
      // Remove duplicates by id
      setGames(prev => {
        const ids = new Set(prev.map(g => g.id));
        return [...prev, ...newGames.filter(g => !ids.has(g.id))];
      });
      if (newGames.length < GAMES_PER_PAGE || games.length + newGames.length >= MAX_GAMES) {
        setHasMoreGames(false);
      }
    } catch (err) {
      setError('Failed to load games. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    setLoading(true);
    setGames([]);
    setPage(1);
    setHasMoreGames(true);
    fetchGamesPage(1);
  }, []);

  // Fetch more games when page increases (but not on first load)
  useEffect(() => {
    if (page === 1) return;
    if (games.length >= MAX_GAMES) return;
    fetchGamesPage(page);
  }, [page]);

  // Add wishlist status
  const addWishlistStatus = (gamesList) => {
    if (!gamesList) return [];
    return gamesList.map(game => ({
      ...game,
      isWishlisted: wishlist.includes(game.id)
    }));
  };

  // Filter and search logic
  const getFilteredGames = () => {
    let filtered = games;
    if (activeCategory !== 'all') {
      filtered = filtered.filter(game => game.category && game.category.includes(activeCategory));
    }
    if (searchQuery && searchQuery.length >= 3) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(q) ||
        (game.description && game.description.toLowerCase().includes(q)) ||
        (game.category && game.category.toLowerCase().includes(q))
      );
    }
    return filtered;
  };

  // Update visible games when games, search, or category changes
  useEffect(() => {
    const filtered = addWishlistStatus(getFilteredGames());
    setVisibleGames(filtered.slice(0, Math.min(games.length, MAX_GAMES)));
  }, [games, searchQuery, activeCategory, wishlist]);

  // Categories
  const categories = [...new Set(games.flatMap(game => game.category ? game.category.split(', ') : []))].filter(Boolean);

  if (loading) {
    return (
      <div className="store-page">
        <div className="container">
          <div className="store-loading">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading games...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="store-page">
        <div className="container mt-5">
          <div className="store-error">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="store-page">
      <div className="container py-5">
        <h1 className="mb-4 text-center">Game Store</h1>
        
        {/* Search and filter */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="search-bar">
              <div className="row">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search games..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isSearching && (
                      <span className="input-group-text bg-transparent border-0">
                        <div className="spinner-border spinner-border-sm text-purple" role="status">
                          <span className="visually-hidden">Searching...</span>
                        </div>
                      </span>
                    )}
                  </div>
                  {searchQuery && searchQuery.length < 3 && (
                    <small className="text-light opacity-75">Type at least 3 characters to search</small>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="category-filter d-flex flex-wrap">
                    <button 
                      className={`btn ${activeCategory === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveCategory('all')}
                    >
                      All
                    </button>
                    {categories.slice(0, 5).map(category => (
                      <button 
                        key={category} 
                        className={`btn ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Game grid */}
        <div className="row g-4">
          {visibleGames.map(game => (
            <div key={game.id} className="col-lg-3 col-md-4 col-sm-6">
              <GameCard 
                game={game} 
                cardType="store" 
                isUserLoggedIn={isUserLoggedIn}
              />
            </div>
          ))}
          
          {visibleGames.length === 0 && !loading && (
            <div className="col-12 text-center py-5">
              <div className="p-4 rounded" style={{ background: 'rgba(61, 18, 94, 0.2)' }}>
                <i className="bi bi-search me-2"></i>
                <p className="text-light opacity-75 mb-0">No games found matching your criteria.</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Next Page Button */}
        {hasMoreGames && !loading && (
          <div className="text-center my-4">
            <button
              className="btn btn-primary"
              onClick={() => setPage(prev => prev + 1)}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'More'}
            </button>
          </div>
        )}
        
        {/* Stats display at the bottom */}
        {visibleGames.length > 0 && (
          <div className="game-stats-container mt-4 mb-5 text-center">
            <div className="stats-pill">
              <span className="stats-label">Showing:</span> 
              <span className="stats-value">{visibleGames.length}</span>
              <span className="stats-separator">of</span>
              <span className="stats-value">{Math.min(games.length, MAX_GAMES)}</span> 
              <span className="stats-label">games</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Store;