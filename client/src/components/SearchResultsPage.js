import { useState, useEffect } from 'react';
import '../css/SearchResultsPage.css';
// Mock search results data
const mockSearchResults = [
  {
    _id: '1',
    name: 'Classic Elegance Automatic',
    description: 'Swiss precision meets timeless design',
    price: 2499,
    originalPrice: 3299,
    stock: 15,
    images: ['https://via.placeholder.com/300x300/1a1a2e/ffd700?text=Watch+1'],
    brand: 'Timepiece',
    target_audience: 'Male',
    water_resistance: '10 ATM',
    movement_type: 'Automatic',
    glass_material: 'Sapphire',
    strap_material: 'Leather',
    ratings: 4.8,
    totalReviews: 248
  },
  {
    _id: '2',
    name: 'Sport Chronograph Pro',
    description: 'Built for performance and style',
    price: 3299,
    stock: 8,
    images: ['https://via.placeholder.com/300x300/1a1a2e/60a5fa?text=Watch+2'],
    brand: 'Timepiece',
    target_audience: 'Male',
    water_resistance: '20 ATM',
    movement_type: 'Quartz',
    glass_material: 'Sapphire',
    strap_material: 'Stainless Steel',
    ratings: 4.9,
    totalReviews: 186
  },
  {
    _id: '3',
    name: 'Diamond Elegance Lady',
    description: 'Sophisticated luxury for women',
    price: 5999,
    stock: 12,
    images: ['https://via.placeholder.com/300x300/1a1a2e/ff6b9d?text=Watch+3'],
    brand: 'Timepiece',
    target_audience: 'Female',
    water_resistance: '5 ATM',
    movement_type: 'Automatic',
    glass_material: 'Sapphire',
    strap_material: 'Leather',
    ratings: 5.0,
    totalReviews: 142
  },
  {
    _id: '4',
    name: 'Minimalist Essence',
    description: 'Clean design, maximum impact',
    price: 1899,
    stock: 25,
    images: ['https://via.placeholder.com/300x300/1a1a2e/34d399?text=Watch+4'],
    brand: 'Timepiece',
    target_audience: 'Unisex',
    water_resistance: '3 ATM',
    movement_type: 'Quartz',
    glass_material: 'Mineral',
    strap_material: 'Leather',
    ratings: 4.6,
    totalReviews: 98
  },
  {
    _id: '5',
    name: 'Pilot Navigator GMT',
    description: 'Aviation-inspired timepiece',
    price: 4299,
    stock: 6,
    images: ['https://via.placeholder.com/300x300/1a1a2e/fbbf24?text=Watch+5'],
    brand: 'Timepiece',
    target_audience: 'Male',
    water_resistance: '10 ATM',
    movement_type: 'Automatic',
    glass_material: 'Sapphire',
    strap_material: 'Nylon',
    ratings: 4.7,
    totalReviews: 156
  }
];

export default function SearchResultsPage() {
  const [searchQuery, setSearchQuery] = useState('watch');
  const [results, setResults] = useState(mockSearchResults);
  const [filteredResults, setFilteredResults] = useState(mockSearchResults);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  
  // Filters
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    brand: 'all',
    audience: 'all',
    movement: 'all',
    minRating: 0
  });

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      applyFiltersAndSort();
      setIsLoading(false);
    }, 500);
  }, [sortBy, filters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsLoading(true);
    // Simulate API search
    setTimeout(() => {
      // In real app, this would be an API call
      setResults(mockSearchResults);
      applyFiltersAndSort();
      setIsLoading(false);
    }, 500);
  };

  const applyFiltersAndSort = () => {
    let filtered = [...results];

    // Apply price filter
    if (filters.priceMin) {
      filtered = filtered.filter(item => item.price >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(item => item.price <= parseFloat(filters.priceMax));
    }

    // Apply brand filter
    if (filters.brand !== 'all') {
      filtered = filtered.filter(item => item.brand === filters.brand);
    }

    // Apply audience filter
    if (filters.audience !== 'all') {
      filtered = filtered.filter(item => item.target_audience === filters.audience);
    }

    // Apply movement filter
    if (filters.movement !== 'all') {
      filtered = filtered.filter(item => item.movement_type === filters.movement);
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(item => item.ratings >= filters.minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.ratings - a.ratings);
        break;
      case 'newest':
        // Would sort by date in real app
        break;
      default:
        // relevance - keep as is
        break;
    }

    setFilteredResults(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      brand: 'all',
      audience: 'all',
      movement: 'all',
      minRating: 0
    });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating));
  };

  return (
    <div className="search-results-page">
      {/* Search Header */}
      <div className="search-header">
        <div className="container">
          <div className="search-bar-wrapper">
            <input
              type="text"
              className="search-input2"
              placeholder="Search for watches, brands, collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            />
            <button className="search-btn" onClick={() => handleSearch(searchQuery)}>
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="results-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="clear-btn" onClick={clearFilters}>Clear All</button>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div className="filter-group">
              <h4>Brand</h4>
              <select 
                value={filters.brand} 
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              >
                <option value="all">All Brands</option>
                <option value="Timepiece">Timepiece</option>
                <option value="Rolex">Rolex</option>
                <option value="Omega">Omega</option>
              </select>
            </div>

            {/* Target Audience */}
            <div className="filter-group">
              <h4>For</h4>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="audience"
                    value="all"
                    checked={filters.audience === 'all'}
                    onChange={(e) => handleFilterChange('audience', e.target.value)}
                  />
                  All
                </label>
                <label>
                  <input
                    type="radio"
                    name="audience"
                    value="Male"
                    checked={filters.audience === 'Male'}
                    onChange={(e) => handleFilterChange('audience', e.target.value)}
                  />
                  Men
                </label>
                <label>
                  <input
                    type="radio"
                    name="audience"
                    value="Female"
                    checked={filters.audience === 'Female'}
                    onChange={(e) => handleFilterChange('audience', e.target.value)}
                  />
                  Women
                </label>
                <label>
                  <input
                    type="radio"
                    name="audience"
                    value="Unisex"
                    checked={filters.audience === 'Unisex'}
                    onChange={(e) => handleFilterChange('audience', e.target.value)}
                  />
                  Unisex
                </label>
              </div>
            </div>

            {/* Movement Type */}
            <div className="filter-group">
              <h4>Movement Type</h4>
              <select 
                value={filters.movement} 
                onChange={(e) => handleFilterChange('movement', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Automatic">Automatic</option>
                <option value="Quartz">Quartz</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <h4>Minimum Rating</h4>
              <div className="rating-filter">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="rating-option">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.minRating === rating}
                      onChange={() => handleFilterChange('minRating', rating)}
                    />
                    <span>{renderStars(rating)} and up</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="results-content">
            {/* Results Header */}
            <div className="results-header">
              <div className="results-info">
                <h2>Search Results for "{searchQuery}"</h2>
                <p>{filteredResults.length} products found</p>
              </div>

              <div className="results-controls">
                <div className="view-toggle">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    ⊞
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    ☰
                  </button>
                </div>

                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Searching...</p>
              </div>
            )}

            {/* No Results */}
            {!isLoading && filteredResults.length === 0 && (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Results Grid/List */}
            {!isLoading && filteredResults.length > 0 && (
              <div className={`results-${viewMode}`}>
                {filteredResults.map(product => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      <img src={product.images[0]} alt={product.name} />
                      {product.originalPrice && (
                        <div className="discount-badge">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </div>
                      )}
                      <div className="quick-actions">
                        <button className="action-btn">👁️</button>
                        <button className="action-btn">❤️</button>
                      </div>
                    </div>

                    <div className="product-info">
                      <div className="product-brand">{product.brand}</div>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>

                      <div className="product-rating">
                        <span className="stars">{renderStars(product.ratings)}</span>
                        <span className="rating-value">{product.ratings}</span>
                        <span className="reviews">({product.totalReviews})</span>
                      </div>

                      <div className="product-specs">
                        <span className="spec-badge">{product.movement_type}</span>
                        <span className="spec-badge">{product.water_resistance}</span>
                        <span className="spec-badge">{product.target_audience}</span>
                      </div>

                      <div className="product-footer1">
                        <div className="price-section">
                          <span className="current-price">${product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="original-price">${product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        <button className="add-cart-btn">🛒 Add to Cart</button>
                      </div>

                      {product.stock < 10 && (
                        <div className="stock-warning">Only {product.stock} left in stock!</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      </div>
  )
}
