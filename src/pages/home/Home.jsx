
import GameCard from '../../components/GameCard/GameCard.jsx';
import { initialState } from '../../store/initialStore.js';
import './Home.css';


function Home() {

  const storeData = initialState();
  const { games, user, categories } = storeData;
  
  // Filter games based on their properties
  const featuredGames = games.allGames.filter(game => game.featured).slice(0, 3);
  const newReleases = games.allGames.filter(game => game.new_release).slice(0, 4);
  const specialOffers = games.allGames.filter(game => game.discount && game.discount > 0);

  // Checking if user is authenticated
  const isUserLoggedIn = user.isAuthenticated;
  
  // Adding wishlist status to games based on user's wishlist
  const addWishlistStatus = (gamesList) => {
    return gamesList.map(game => ({
      ...game,
      isWishlisted: user.wishlist.includes(game.id)
    }));
  };

  const featuredGamesWithWishlist = addWishlistStatus(featuredGames);
  const newReleasesWithWishlist = addWishlistStatus(newReleases);
  const specialOffersWithWishlist = addWishlistStatus(specialOffers);

  return (
    <div className="home-page">
      {/* Hero Section */}
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
        {/* Featured Games Section */}
        <section className="featured-games mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">Featured Games</h2>
            <a href="/store" className="btn btn-custom">View All</a>
          </div>
          
          <div className="row justify-content-center">
            {featuredGamesWithWishlist.map(game => (
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

        {/* New Releases Section */}
        <section className="new-releases mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">New Releases</h2>
            <a href="/store" className="btn btn-custom">View All</a>
          </div>
          
          <div className="row g-4">
            {newReleasesWithWishlist.map(game => (
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

        {/* Special Offers Section - Horizontal Cards */}
        <section className="special-offers mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">Special Offers</h2>
            <a href="/store" className="btn btn-custom">View All</a>
          </div>
          
          <div className="row">
            <div className="col-12">
              {specialOffersWithWishlist.map(game => (
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