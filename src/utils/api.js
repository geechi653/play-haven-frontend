// Import initialState for mock data
import { initialState } from '../store/initialStore.js';

const API_BASE = import.meta.env.VITE_API_URL;

// Base API functions for todos
export async function fetchTodos(userId) {
  const response = await fetch(`${API_BASE}/api/todos?user_id=${userId}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

export async function addTodo(todo) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  };
  const response = await fetch(`${API_BASE}/api/todos`, options);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

export async function deleteTodo(todoId, userId) {
  const options = {
    method: 'DELETE',
  };
  const response = await fetch(
    `${API_BASE}/api/todos/${todoId}?user_id=${userId}`,
    options
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

// Steam API endpoints
export async function fetchTopGames(limit = 15, offset = 0) {
  try {
    const response = await fetch(`${API_BASE}/api/steam/top-games?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      console.error('Error fetching top games:', response.status, response.statusText);
      throw new Error(`Failed to fetch top games: ${response.statusText}`);
    }
    const games = await response.json();
    if (games && games.length > 0) {
      console.log('[DEBUG] First top game object:', games[0]);
    }
    // Ensure every game has an id property
    return games.map(game => {
      const id = game.id || game.appId || game.gameId || game.steam_appid || game.steamId || game._id;
      if (!id) {
        console.error('[DEBUG] Game object missing id:', game);
      }
      return { ...game, id };
    });
  } catch (error) {
    console.error('Error in fetchTopGames:', error);
    // If the API call fails, fall back to mock data
    const storeData = initialState();
    const allGames = storeData.games.allGames;
    // Remove the rating filter so you always get enough games
    const topGames = allGames
      .sort((a, b) => b.rating - a.rating)
      .slice(offset, offset + limit);
    return topGames;
  }
}

export async function fetchDiscountedGames(limit = 15, offset = 0) {
  try {
    const response = await fetch(`${API_BASE}/api/steam/discounted-games?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      console.error('Error fetching discounted games:', response.status, response.statusText);
      throw new Error(`Failed to fetch discounted games: ${response.statusText}`);
    }
    const games = await response.json();
    if (games && games.length > 0) {
      console.log('[DEBUG] First discounted game object:', games[0]);
    }
    return games.map(game => {
      const id = game.id || game.appId || game.gameId || game.steam_appid || game.steamId || game._id;
      if (!id) {
        console.error('[DEBUG] Discounted game object missing id:', game);
      }
      return { ...game, id };
    });
  } catch (error) {
    console.error('Error in fetchDiscountedGames:', error);
    // If the API call fails, fall back to mock data
    const storeData = initialState();
    const allGames = storeData.games.allGames;
    const discountedGames = allGames
      .filter(game => game.discount && game.discount > 0)
      .sort((a, b) => b.discount - a.discount)
      .slice(offset, offset + limit);
    return discountedGames;
  }
}

export async function fetchFeaturedGames(limit = 10, offset = 0) {
  try {
    const response = await fetch(`${API_BASE}/api/steam/featured-games?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      console.error('Error fetching featured games:', response.status, response.statusText);
      throw new Error(`Failed to fetch featured games: ${response.statusText}`);
    }
    const games = await response.json();
    if (games && games.length > 0) {
      console.log('[DEBUG] First featured game object:', games[0]);
    }
    return games.map(game => {
      const id = game.id || game.appId || game.gameId || game.steam_appid || game.steamId || game._id;
      if (!id) {
        console.error('[DEBUG] Featured game object missing id:', game);
      }
      return { ...game, id };
    });
  } catch (error) {
    console.error('Error in fetchFeaturedGames:', error);
    // If the API call fails, fall back to mock data
    const storeData = initialState();
    const allGames = storeData.games.allGames;
    const featuredGames = allGames
      .filter(game => game.featured === true)
      .slice(offset, offset + limit);
    return featuredGames;
  }
}

export async function fetchMoreGames(page = 1, limit = 12, category = 'all') {
  try {
    const offset = (page - 1) * limit;
    // Try to fetch from API
    try {
      const response = await fetch(`${API_BASE}/api/steam/games?limit=${limit}&offset=${offset}&category=${encodeURIComponent(category)}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (apiError) {
      console.error('API fetch failed, falling back to mock data:', apiError);
    }
    
    // Fallback to mock data
    const storeData = initialState();
    const allGames = storeData.games.allGames;
    
    // Filter by category if needed
    const filteredGames = category === 'all' 
      ? allGames 
      : allGames.filter(game => game.category && game.category.includes(category));
    
    // Calculate pagination
    return filteredGames.slice(offset, offset + limit);
  } catch (error) {
    console.error('Error in fetchMoreGames:', error);
    return [];
  }
}

export async function fetchGameDetails(appId) {
  try {
    const response = await fetch(`${API_BASE}/api/steam/games/${appId}`);
    if (!response.ok) {
      console.error('Error fetching game details:', response.status, response.statusText);
      throw new Error(`Failed to fetch game details: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchGameDetails:', error);
    throw error; // Rethrow for this one as we need to handle it in the component
  }
}

export async function searchGames(query, limit = 20) {
  try {
    if (!query || query.length < 3) {
      return [];
    }
    
    // Try to fetch from the API first
    try {
      const response = await fetch(`${API_BASE}/api/steam/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (apiError) {
      console.error('API search failed, falling back to client-side search:', apiError);
    }
    
    // Fallback to client-side search if API call fails
    const storeData = initialState();
    const allGames = storeData.games.allGames;
    
    // Create a case-insensitive search that handles partial matches
    const searchQuery = query.toLowerCase();
    
    // Enhanced search algorithm with tokenization and scoring
    const results = allGames
      .map(game => {
        // Initialize score
        let score = 0;
        
        // Check title match (highest priority)
        if (game.title.toLowerCase() === searchQuery) {
          score += 100; // Exact match gets highest score
        } else if (game.title.toLowerCase().includes(searchQuery)) {
          score += 50; // Partial match gets medium score
        }
        
        // Check individual words in title
        const titleWords = game.title.toLowerCase().split(/\s+/);
        const queryWords = searchQuery.split(/\s+/);
        
        queryWords.forEach(queryWord => {
          if (queryWord.length >= 3) { // Only consider words with 3+ characters
            titleWords.forEach(titleWord => {
              if (titleWord === queryWord) {
                score += 30; // Exact word match
              } else if (titleWord.includes(queryWord)) {
                score += 15; // Partial word match
              }
            });
          }
        });
        
        // Check description match (lower priority)
        if (game.description && game.description.toLowerCase().includes(searchQuery)) {
          score += 20;
        }
        
        // Check category match (lowest priority)
        if (game.category && game.category.toLowerCase().includes(searchQuery)) {
          score += 10;
        }
        
        return { ...game, searchScore: score };
      })
      .filter(game => game.searchScore > 0) // Only keep games with a positive score
      .sort((a, b) => b.searchScore - a.searchScore) // Sort by score (highest first)
      .slice(0, limit); // Limit results
    
    return results;
  } catch (error) {
    console.error('Error in searchGames:', error);
    return []; // Return empty array instead of throwing
  }
}

export async function downloadGame(gameId, userId) {
  try {
    // Ensure we have authentication
    if (!userId) {
      throw new Error('User must be logged in to download games');
    }
    
    const response = await fetch(`${API_BASE}/api/steam/download/${gameId}?userId=${userId}`);
    
    if (!response.ok) {
      console.error('Error downloading game:', response.status, response.statusText);
      throw new Error(`Failed to download game: ${response.statusText}`);
    }
    
    const gameData = await response.json();
    return gameData;
  } catch (error) {
    console.error('Error in downloadGame:', error);
    throw error; // Rethrow to handle in the component
  }
}

// User authentication API
export async function loginUser({ username, password }) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (response.ok && data && data.token) {
    return data;
  } else {
    throw new Error(data?.message || "Invalid username or password");
  }
}

// User registration API
export async function registerUser(user) {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  if (response.ok && data) {
    return data;
  } else {
    throw new Error(data?.message || "Registration failed");
  }
}

// Wishlist API functions
export async function fetchUserWishlist(userId, token) {
  const response = await fetch(`${API_BASE}/api/user/${userId}/wishlist`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch wishlist');
  }
  const data = await response.json();
  // Assuming backend returns { success: true, data: [game objects] }
  return data.data ? data.data.map(game => game.id) : [];
}

export async function addToWishlist(userId, gameId, token) {
  const response = await fetch(`${API_BASE}/api/user/${userId}/wishlist/add`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ game_id: gameId }),
  });
  if (!response.ok) {
    throw new Error('Failed to add to wishlist');
  }
  return await response.json();
}

export async function removeFromWishlist(userId, gameId, token) {
  const response = await fetch(`${API_BASE}/api/user/${userId}/wishlist/game/${gameId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to remove from wishlist');
  }
  return await response.json();
}

export async function addToLibrary(userId, gameId, token) {
  const response = await fetch(`${API_BASE}/api/user/${userId}/library/add`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ game_id: gameId }),
  });
  if (!response.ok) {
    throw new Error('Failed to add to library');
  }
  return await response.json();
}

export async function fetchUserLibrary(userId, token) {
  const response = await fetch(`${API_BASE}/api/user/${userId}/library`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch library');
  }
  const data = await response.json();
  // Assuming backend returns { success: true, data: [game objects] }
  return data.data ? data.data.map(game => game.id) : [];
}

export async function fetchUserCart(userId, token) {
  try {
    const response = await fetch(`${API_BASE}/api/cart?userId=${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    
    const data = await response.json();
    // Backend returns array of game IDs, convert to cart item format
    return Array.isArray(data) ? data.map(gameId => ({ gameId, quantity: 1 })) : [];
  } catch (error) {
    console.error('Error in fetchUserCart:', error);
    throw error;
  }
}

export async function addToCart(userId, gameId, token, quantity = 1) {
  try {
    if (!userId) {
      throw new Error('User must be logged in to add items to cart');
    }
    console.log('[DEBUG] addToCart payload:', { userId, gameId, token, quantity }); // Debug log
    const response = await fetch(`${API_BASE}/api/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId: userId,
        gameId: gameId
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in addToCart:', error);
    throw error;
  }
}

export async function removeFromCart(userId, gameId, token) {
  try {
    if (!userId) {
      throw new Error('User must be logged in to remove items from cart');
    }
    
    const response = await fetch(`${API_BASE}/api/cart/remove/${gameId}?userId=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove from cart');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    throw error;
  }
}

export async function updateCartQuantity(userId, gameId, quantity, token) {
  try {
    console.warn('updateCartQuantity not implemented in backend yet');
    return { message: 'Quantity update not supported yet' };
  } catch (error) {
    console.error('Error in updateCartQuantity:', error);
    throw error;
  }
}

export async function clearCart(userId, token) {
  try {
    if (!userId) {
      throw new Error('User must be logged in to clear cart');
    }
    
    const response = await fetch(`${API_BASE}/api/cart/clear?userId=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in clearCart:', error);
    throw error;
  }
}

export async function fetchUserProfile(userId, token) {
  const API_BASE = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_BASE}/api/profiles/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
export async function fetchGameNews(appId = 440, count = 5, maxlength = 500) {
  const response = await fetch(`${API_BASE}/api/steam/games/${appId}/news?count=${count}&maxlength=${maxlength}`);
  if (!response.ok) throw new Error('Failed to fetch news');

  return await response.json();
}
