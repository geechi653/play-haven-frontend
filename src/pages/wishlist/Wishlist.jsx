// import { useState, useEffect } from 'react';
// import GameCard from '../../components/GameCard/GameCard.jsx';
// import { useGlobalStore } from '../../hooks/useGlobalStore';
// import { fetchUserWishlist } from '../../utils/api';
// import './Wishlist.css';

// function Wishlist() {
//   const { store, dispatch } = useGlobalStore();
//   const games = store.games.allGames;
//   const user = store.user;
//   const wishlist = store.wishlist.items;

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedGenre, setSelectedGenre] = useState('all');
//   const [selectedPlatform, setSelectedPlatform] = useState('all');
//   const [sortBy, setSortBy] = useState('recent');
//   const [removedGames, setRemovedGames] = useState(new Set());

//   useEffect(() => {
//     if (user.isAuthenticated && user.userId && user.token) {
//       fetchUserWishlist(user.userId, user.token)
//         .then(ids => {
//           dispatch({ type: 'SET_WISHLIST', payload: { items: ids } });
//         })
//         .catch(() => {
//           dispatch({ type: 'SET_WISHLIST', payload: { items: [] } });
//         });
//     }
//   }, [user.isAuthenticated, user.userId, user.token, dispatch]);

//   useEffect(() => {
//     const handleWishlistUpdate = (event) => {
//       const { gameId, action } = event.detail;
//       if (action === 'remove') {
//         setRemovedGames(prev => new Set([...prev, gameId]));
//       }
//     };
//     window.addEventListener('wishlistUpdated', handleWishlistUpdate);
//     return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
//   }, []);

//   const wishlistGames = games.filter(game =>
//     user.isAuthenticated &&
//     wishlist &&
//     wishlist.includes(game.id) &&
//     !removedGames.has(game.id)
//   );

//   const displayGames = wishlistGames;

//   const filteredGames = displayGames.filter(game => {
//     const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       game.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesGenre = selectedGenre === 'all' ||
//       (game.genres && game.genres.includes(selectedGenre));
//     const matchesPlatform = selectedPlatform === 'all' ||
//       (game.platform && game.platform.some(p => p.toLowerCase() === selectedPlatform.toLowerCase()));
//     return matchesSearch && matchesGenre && matchesPlatform;
//   });

//   const sortedGames = [...filteredGames].sort((a, b) => {
//     switch (sortBy) {
//       case 'alphabetical':
//         return a.title.localeCompare(b.title);
//       case 'recent':
//         return new Date(b.release_date || '2024-01-01') - new Date(a.release_date || '2024-01-01');
//       case 'price_low':
//         return parseFloat(a.price || 0) - parseFloat(b.price || 0);
//       case 'price_high':
//         return parseFloat(b.price || 0) - parseFloat(a.price || 0);
//       default:
//         return 0;
//     }
//   });

//   const allGenres = [...new Set(displayGames.flatMap(game => game.genres || []))];
//   const allPlatforms = [...new Set(displayGames.flatMap(game => game.platform || []))];

//   return (
//     <div className="wishlist-page">
//       <div className="container">
//         <div className="wishlist-header">
//           <h1 className="wishlist-title">Your Wishlist</h1>
//           <p className="wishlist-subtitle">
//             {sortedGames.length} game{sortedGames.length !== 1 ? 's' : ''} on your wishlist
//           </p>
//         </div>

//         <div className="wishlist-controls">
//           <div className="row g-3 align-items-end">
//             {/* Search Bar */}
//             <div className="col-md-4">
//               <label htmlFor="search" className="form-label">Search Games</label>
//               <input
//                 type="text"
//                 id="search"
//                 className="form-control wishlist-search"
//                 placeholder="Search your wishlist..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div className="col-md-2">
//               <label htmlFor="genre" className="form-label">Genre</label>
//               <select
//                 id="genre"
//                 className="form-select wishlist-filter"
//                 value={selectedGenre}
//                 onChange={(e) => setSelectedGenre(e.target.value)}
//               >
//                 <option value="all">All Genres</option>
//                 {allGenres.map(genre => (
//                   <option key={genre} value={genre}>{genre}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-2">
//               <label htmlFor="platform" className="form-label">Platform</label>
//               <select
//                 id="platform"
//                 className="form-select wishlist-filter"
//                 value={selectedPlatform}
//                 onChange={(e) => setSelectedPlatform(e.target.value)}
//               >
//                 <option value="all">All Platforms</option>
//                 {allPlatforms.map(platform => (
//                   <option key={platform} value={platform}>{platform}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-2">
//               <label htmlFor="sort" className="form-label">Sort By</label>
//               <select
//                 id="sort"
//                 className="form-select wishlist-filter"
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//               >
//                 <option value="recent">Recently Added</option>
//                 <option value="alphabetical">A-Z</option>
//                 <option value="price_low">Price: Low to High</option>
//                 <option value="price_high">Price: High to Low</option>
//               </select>
//             </div>

//             <div className="col-md-2">
//               <button
//                 className="btn btn-outline-secondary w-100"
//                 onClick={() => {
//                   setSearchTerm('');
//                   setSelectedGenre('all');
//                   setSelectedPlatform('all');
//                   setSortBy('recent');
//                 }}
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="wishlist-games">
//           {!user.isAuthenticated ? (
//             <div className="no-games-message">
//               <div className="no-games-content">
//                 <h3>Please Log In</h3>
//                 <p>
//                   You need to be logged in to view your wishlist. 
//                   Please log in to see your saved games.
//                 </p>
//                 <a href="/login" className="btn btn-primary">
//                   Log In
//                 </a>
//               </div>
//             </div>
//           ) : sortedGames.length > 0 ? (
//             <div className="games-list">
//               {sortedGames.map(game => (
//                 <div key={game.id} className="wishlist-game-item">
//                   <GameCard 
//                     game={game} 
//                     cardType="wishlist" 
//                     isUserLoggedIn={user.isAuthenticated}
//                   />
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="no-games-message">
//               <div className="no-games-content">
//                 <h3>Your Wishlist is Empty</h3>
//                 <p>
//                   You haven't added any games to your wishlist yet. Browse our store to find amazing games 
//                   and save them to your wishlist for later!
//                 </p>
//                 <div className="d-flex gap-3 justify-content-center">
//                   <a href="/store" className="btn btn-primary">
//                     Browse Store
//                   </a>
//                   <a href="/home" className="btn btn-outline-primary">
//                     View Featured Games
//                   </a>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Wishlist;


// BELOW IS WORKAROUND

import { useState, useEffect } from 'react';
import GameCard from '../../components/GameCard/GameCard.jsx';
import { useGlobalStore } from '../../hooks/useGlobalStore';
// import { fetchUserWishlist } from '../../utils/api'; // Commented out for dummy data
import './Wishlist.css';

// Dummy games data for wishlist
const dummyWishlistGames = [
  {
    id: 7,
    title: "Elden Ring",
    description: "A new fantasy action RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.",
    image_url: "https://via.placeholder.com/300x400/FFD93D/FFFFFF?text=Elden+Ring",
    price: 59.99,
    original_price: 59.99,
    discount: 0,
    status: "Available",
    genres: ["Action", "RPG", "Adventure"],
    platform: ["Windows", "PlayStation", "Xbox"],
    release_date: "2022-02-25",
    isWishlisted: true
  },
  {
    id: 8,
    title: "God of War",
    description: "His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods.",
    image_url: "https://via.placeholder.com/300x400/6C5CE7/FFFFFF?text=God+of+War",
    price: 49.99,
    original_price: 59.99,
    discount: 17,
    status: "Available",
    genres: ["Action", "Adventure", "Mythology"],
    platform: ["Windows", "PlayStation"],
    release_date: "2022-01-14",
    isWishlisted: true
  },
  {
    id: 9,
    title: "Disco Elysium",
    description: "A groundbreaking role playing game. You're a detective with a unique skill system at your disposal.",
    image_url: "https://via.placeholder.com/300x400/00B894/FFFFFF?text=Disco+Elysium",
    price: 39.99,
    original_price: 39.99,
    discount: 0,
    status: "Available",
    genres: ["RPG", "Indie", "Story Rich"],
    platform: ["Windows", "Mac", "PlayStation", "Xbox", "Nintendo Switch"],
    release_date: "2019-10-15",
    isWishlisted: true
  },
  {
    id: 10,
    title: "Ori and the Will of the Wisps",
    description: "Play as the lovable Ori, a guardian spirit, and immerse yourself in Niwen, a world torn apart by decay.",
    image_url: "https://via.placeholder.com/300x400/E17055/FFFFFF?text=Ori+Wisps",
    price: 29.99,
    original_price: 29.99,
    discount: 0,
    status: "Available",
    genres: ["Platformer", "Adventure", "Indie"],
    platform: ["Windows", "Xbox", "Nintendo Switch"],
    release_date: "2020-03-11",
    isWishlisted: true
  },
  {
    id: 11,
    title: "Red Dead Redemption 2",
    description: "Winner of over 175 Game of the Year Awards, RDR2 is an epic tale of life in America's unforgiving heartland.",
    image_url: "https://via.placeholder.com/300x400/A29BFE/FFFFFF?text=RDR2",
    price: 59.99,
    original_price: 79.99,
    discount: 25,
    status: "Available",
    genres: ["Action", "Adventure", "Western"],
    platform: ["Windows", "PlayStation", "Xbox"],
    release_date: "2019-11-05",
    isWishlisted: true
  }
];

// Dummy wishlist items (game IDs that user has wishlisted)
const dummyWishlistItems = [7, 8, 9, 10, 11];

function Wishlist() {
  const { store, dispatch } = useGlobalStore();
  const games = store.games;
  const user = store.user;
  const wishlist = store.wishlist?.items;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [removedGames, setRemovedGames] = useState(new Set());

  useEffect(() => {
    if (user.isAuthenticated && user.userId && user.token) {
      // Use dummy data for backup branch
      dispatch({ type: 'SET_WISHLIST', payload: { items: dummyWishlistItems } });
      dispatch({ type: 'SET_GAMES', payload: { allGames: dummyWishlistGames } });
    }
  }, [user.isAuthenticated, user.userId, user.token, dispatch]);

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

  // Always use dummy data for backup branch
  const allGames = dummyWishlistGames;
  const wishlistItems = dummyWishlistItems;

  const wishlistGames = allGames.filter(game =>
    user.isAuthenticated &&
    wishlistItems &&
    wishlistItems.includes(game.id) &&
    !removedGames.has(game.id)
  );

  const displayGames = wishlistGames;

  const filteredGames = displayGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' ||
      (game.genres && game.genres.includes(selectedGenre));
    // Fix platform filtering to handle both string and array formats
    const matchesPlatform = selectedPlatform === 'all' ||
      (Array.isArray(game.platform) 
        ? game.platform.some(p => p.toLowerCase() === selectedPlatform.toLowerCase())
        : game.platform && game.platform.toLowerCase().includes(selectedPlatform.toLowerCase()));
    return matchesSearch && matchesGenre && matchesPlatform;
  });

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

  // Fix genre and platform extraction
  const allGenres = [...new Set(displayGames.flatMap(game => game.genres || []))];
  const allPlatforms = [...new Set(displayGames.flatMap(game => {
    if (Array.isArray(game.platform)) {
      return game.platform;
    } else if (typeof game.platform === 'string') {
      return game.platform.split(', ');
    }
    return [];
  }))];

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