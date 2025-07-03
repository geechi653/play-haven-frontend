import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameCard from '../../components/GameCard/GameCard.jsx';
import GameFilters from '../../components/GameFilters/GameFilters.jsx';
import { useGlobalStore } from '../../hooks/useGlobalStore';
import { fetchUserLibraryItems } from '../../utils/api';
import './Library.css';

function Library() {
  const { store } = useGlobalStore();
  const location = useLocation();
  const user = store.user;
  const [libraryGames, setLibraryGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [recentlyPurchased, setRecentlyPurchased] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    // Check for purchase success from navigation state
    if (location.state?.purchaseSuccess) {
      setPurchaseSuccess(true);
      // Hide success message after 5 seconds
      setTimeout(() => {
        setPurchaseSuccess(false);
      }, 5000);
    }
  }, [location.state]);

  useEffect(() => {
    // Load recently purchased games from localStorage
    const recentlyPurchasedData = localStorage.getItem('recentlyPurchased');
    if (recentlyPurchasedData) {
      try {
        const parsed = JSON.parse(recentlyPurchasedData);
        // Filter out items older than 7 days
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const recent = parsed.filter(item => item.purchaseDate > sevenDaysAgo);
        setRecentlyPurchased(recent);
        
        // Update localStorage with filtered data
        localStorage.setItem('recentlyPurchased', JSON.stringify(recent));
        console.log('[DEBUG] Recently purchased games:', recent);
      } catch (error) {
        console.error('Error parsing recently purchased games:', error);
        setRecentlyPurchased([]);
      }
    }
  }, []);

  useEffect(() => {
    if (user.isAuthenticated && user.userId && user.token) {
      setLoading(true);
      fetchUserLibraryItems(user.userId, user.token)
        .then(data => {
          console.log('[DEBUG] Library API response:', data);
          
          let gamesList = [];
          if (Array.isArray(data)) {
            gamesList = data.map(game => ({
              ...game,
              addedToLibraryDate: Date.now() // Add current time as fallback
            }));
          } else if (data && data.data && Array.isArray(data.data)) {
            gamesList = data.data.map(item => {
              // Check if this game was recently purchased
              const recentPurchase = recentlyPurchased.find(rp => rp.gameId === item.game?.id);
              console.log('[DEBUG] Checking game for NEW badge:', item.game?.title, 'Game ID:', item.game?.id, 'Recent purchase:', recentPurchase);
              return {
                ...item.game,
                library_id: item.library_id,
                created_at: item.created_at,
                addedToLibraryDate: recentPurchase ? recentPurchase.purchaseDate : 
                  (item.created_at ? new Date(item.created_at).getTime() : Date.now()),
                isNew: !!recentPurchase
              };
            });
          } else if (data && data.games && Array.isArray(data.games)) {
            gamesList = data.games.map(game => ({
              ...game,
              addedToLibraryDate: Date.now() // Add current time as fallback
            }));
          } else {
            console.log('[DEBUG] Unexpected library response structure:', data);
            gamesList = [];
          }
          
          setLibraryGames(gamesList);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch library:', error);
          setLibraryGames([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user.isAuthenticated, user.userId, user.token, recentlyPurchased]);

  // Add a focus event listener to refresh the recently purchased data when returning to the page
  useEffect(() => {
    const handleFocus = () => {
      // Refresh recently purchased games when the page gains focus
      const recentlyPurchasedData = localStorage.getItem('recentlyPurchased');
      if (recentlyPurchasedData) {
        try {
          const parsed = JSON.parse(recentlyPurchasedData);
          const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
          const recent = parsed.filter(item => item.purchaseDate > sevenDaysAgo);
          setRecentlyPurchased(recent);
          console.log('[DEBUG] Refreshed recently purchased games on focus:', recent);
        } catch (error) {
          console.error('Error refreshing recently purchased games:', error);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const displayGames = Array.isArray(libraryGames) ? libraryGames : [];

  const filteredGames = displayGames.filter(game => {
    const matchesSearch = (game.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (game.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre === 'all' || 
                        (game.category && game.category.toLowerCase().includes(selectedGenre.toLowerCase()));
    
    const matchesPlatform = selectedPlatform === 'all' || 
                           (game.platform && game.platform.toLowerCase().includes(selectedPlatform.toLowerCase()));
    
    return matchesSearch && matchesGenre && matchesPlatform;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return (a.title || '').localeCompare(b.title || '');
      case 'recent':
        // Prioritize recently purchased games, then use addedToLibraryDate
        if (a.isNew && !b.isNew) return -1; // a comes first (recently purchased)
        if (!a.isNew && b.isNew) return 1;  // b comes first (recently purchased)
        
        // If both are new or both are not new, sort by date
        const dateA = a.addedToLibraryDate || 
                     (a.created_at ? new Date(a.created_at).getTime() : 0);
        const dateB = b.addedToLibraryDate || 
                     (b.created_at ? new Date(b.created_at).getTime() : 0);
        console.log('[DEBUG] Sorting:', a.title, 'dateA:', new Date(dateA).toLocaleString(), 'isNew:', a.isNew, 'vs', b.title, 'dateB:', new Date(dateB).toLocaleString(), 'isNew:', b.isNew);
        return dateB - dateA; // Most recent first
      case 'playtime':
        return (b.playtime || 0) - (a.playtime || 0);
      default:
        return 0;
    }
  });

  const allGenres = [...new Set(displayGames.flatMap(game => 
    game.category ? game.category.split(', ').map(g => g.trim()) : []
  ))];
  const allPlatforms = [...new Set(displayGames.map(game => game.platform).filter(Boolean))];

  return (
    <div className="library-page">
      <div className="container">

        <div className="library-header">
          <h1 className="library-title">Your Library</h1>
          <p className="library-subtitle">
            {loading ? 'Loading...' : `${sortedGames.length} game${sortedGames.length !== 1 ? 's' : ''} in your library`}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <GameFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              selectedPlatform={selectedPlatform}
              setSelectedPlatform={setSelectedPlatform}
              sortBy={sortBy}
              setSortBy={setSortBy}
              allGenres={allGenres}
              allPlatforms={allPlatforms}
              searchPlaceholder="Search your library..."
              sortOptions={[
                { value: 'recent', label: 'Recently Added' },
                { value: 'alphabetical', label: 'A-Z' },
                { value: 'playtime', label: 'Most Played' }
              ]}
            />

        <div className="library-games">
          {!user.isAuthenticated ? (
            <div className="no-games-message">
              <div className="no-games-content">
                <h3>Sign in to see your library</h3>
                <p>
                  Log in to view and manage your game library.
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
                    showNewBadge={game.isNew}
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
        </>
        )}
      </div>
    </div>
  );
}

export default Library;