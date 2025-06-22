import { useState } from 'react';
import GameCard from '../../components/GameCard/GameCard.jsx';
import { initialState } from '../../store/initialStore.js';
import './Library.css';

function Library() {
  const storeData = initialState();
  const { games, user } = storeData;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Get user's library games (games that have been purchased)
  // Expected user.library structure: [gameId1, gameId2, gameId3, ...]
  // This array gets populated when user completes purchase through Cart -> Checkout process
  const libraryGames = games.allGames.filter(game => 
    user.isAuthenticated && user.library && user.library.includes(game.id)
  );

  // Show purchased games only - if no games purchased, show empty state
  const displayGames = libraryGames;

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

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'recent':
        return new Date(b.release_date || '2024-01-01') - new Date(a.release_date || '2024-01-01');
      case 'playtime':
        return (b.playtime || 0) - (a.playtime || 0);
      default:
        return 0;
    }
  });

  const allGenres = [...new Set(displayGames.flatMap(game => game.genres || []))];
  const allPlatforms = [...new Set(displayGames.flatMap(game => game.platform || []))];

  return (
    <div className="library-page">
      <div className="container">

        <div className="library-header">
          <h1 className="library-title">Your Library</h1>
          <p className="library-subtitle">
            {sortedGames.length} game{sortedGames.length !== 1 ? 's' : ''} in your collection
          </p>
        </div>

        <div className="library-controls">
          <div className="row g-3 align-items-end">
            {/* Search Bar */}
            <div className="col-md-4">
              <label htmlFor="search" className="form-label">Search Games</label>
              <input
                type="text"
                id="search"
                className="form-control library-search"
                placeholder="Search your library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Genre Filter */}
            <div className="col-md-2">
              <label htmlFor="genre" className="form-label">Genre</label>
              <select
                id="genre"
                className="form-select library-filter"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="all">All Genres</option>
                {allGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div className="col-md-2">
              <label htmlFor="platform" className="form-label">Platform</label>
              <select
                id="platform"
                className="form-select library-filter"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="all">All Platforms</option>
                {allPlatforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="col-md-2">
              <label htmlFor="sort" className="form-label">Sort By</label>
              <select
                id="sort"
                className="form-select library-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Recently Added</option>
                <option value="alphabetical">A-Z</option>
                <option value="playtime">Most Played</option>
              </select>
            </div>

            {/* Clear Filters */}
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


        <div className="library-games">
          {!user.isAuthenticated ? (
            <div className="no-games-message">
              <div className="no-games-content">
                <h3>Please Log In</h3>
                <p>
                  You need to be logged in to view your game library. 
                  Please log in to see your purchased games.
                </p>
                <a href="/login" className="btn btn-primary">
                  Log In
                </a>
              </div>
            </div>
          ) : sortedGames.length > 0 ? (
            <div className="games-list">
              {sortedGames.map(game => (
                <div key={game.id} className="library-game-item">
                  <GameCard 
                    game={game} 
                    cardType="library" 
                    isUserLoggedIn={user.isAuthenticated}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-games-message">
              <div className="no-games-content">
                <h3>Your Library is Empty</h3>
                <p>
                  You haven't purchased any games yet. Browse our store to find amazing games, 
                  add them to your cart, and complete your purchase to see them here!
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <a href="/store" className="btn btn-primary">
                    Browse Store
                  </a>
                  <a href="/cart" className="btn btn-outline-primary">
                    View Cart
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

export default Library;