
import { useState, useEffect } from 'react';
import GameCard from '../../components/GameCard/GameCard.jsx';
import { initialState } from '../../store/initialStore.js';
import { fetchFeaturedGames, fetchTopGames, fetchDiscountedGames } from '../../utils/api.js';
import './Home.css';


function Home() {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [discountedGames, setDiscountedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storeData = initialState();
  const { user } = storeData;
  
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        
        // Fetch games from Steam API
        const featured = await fetchFeaturedGames();
        const top = await fetchTopGames();
        const discounted = await fetchDiscountedGames();
        
        setFeaturedGames(featured || []);
        setTopGames(top || []);
        setDiscountedGames(discounted || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading games:', err);
        setError('Failed to load games. Please try again later.');
        setLoading(false);
      }
    };
    
    loadGames();
  }, []);

  // Checking if user is authenticated
  const isUserLoggedIn = user.isAuthenticated;
  
  // Adding wishlist status to games based on user's wishlist
  const addWishlistStatus = (gamesList) => {
    if (!gamesList) return [];
    return gamesList.map(game => ({
      ...game,
      isWishlisted: user.wishlist.includes(game.id)
    }));
  };

  const featuredGamesWithWishlist = addWishlistStatus(featuredGames);
  const topGamesWithWishlist = addWishlistStatus(topGames.slice(0, 4));
  const discountedGamesWithWishlist = addWishlistStatus(discountedGames);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="hero-section text-white py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3">Welcome to Play Heaven</h1>
              <p className="lead mb-4">
                Discover amazing games, connect with fellow gamers, and embark on epic adventures. 
                Your gaming paradise awaits!
              </p>
              <div className="d-flex gap-3">
                <a href="/store" className="btn btn-light btn-lg">Explore Store</a>
                <a href="/news" className="btn btn-outline-light btn-lg">Latest News</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="featured-games mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">Featured Games</h2>
            <a href="/store" className="btn btn-custom">View All</a>
          </div>
          
          <div className="row justify-content-center">
            {featuredGamesWithWishlist.slice(0, 3).map(game => (
              <div key={game.id} className="col-lg-4 col-md-6 col-sm-8 col-10">
                <div className="d-flex justify-content-center">
                  <GameCard 
                    game={game} 
                    cardType="featured" 
                    isUserLoggedIn={isUserLoggedIn}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="new-releases mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">Top Games</h2>
            <a href="/store" className="btn btn-custom">View All</a>
          </div>
          
          <div className="row g-4">
            {topGamesWithWishlist.map(game => (
              <div key={game.id} className="col-xl-3 col-lg-4 col-md-6 d-flex justify-content-center">
                <GameCard 
                  game={game} 
                  cardType="new-release" 
                  isUserLoggedIn={isUserLoggedIn}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="special-offers mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">Discounted Games</h2>
            <a href="/store" className="btn btn-custom">View All</a>
          </div>
          
          <div className="row">
            <div className="col-12">
              {discountedGamesWithWishlist.slice(0, 5).map(game => (
                <GameCard 
                  key={game.id}
                  game={game} 
                  cardType="horizontal" 
                  isUserLoggedIn={isUserLoggedIn}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;