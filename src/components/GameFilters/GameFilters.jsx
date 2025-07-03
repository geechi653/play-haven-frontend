import './GameFilters.css';

function GameFilters({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
  selectedPlatform,
  setSelectedPlatform,
  sortBy,
  setSortBy,
  allGenres = [],
  allPlatforms = [],
  searchPlaceholder = "Search games...",
  sortOptions = [
    { value: 'recent', label: 'Recently Added' },
    { value: 'alphabetical', label: 'A-Z' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' }
  ]
}) {
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('all');
    setSelectedPlatform('all');
    setSortBy('recent');
  };

  return (
    <div className="game-filters">
      <div className="row g-3 align-items-end">
        <div className="col-md-4">
          <label htmlFor="search" className="form-label">Search Games</label>
          <input
            type="text"
            id="search"
            className="form-control game-search"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label htmlFor="genre" className="form-label">Genre</label>
          <select
            id="genre"
            className="form-select game-filter"
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
            className="form-select game-filter"
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
            className="form-select game-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameFilters;
