// // Import initialState for mock data
// import { initialState } from '../store/initialStore.js';

// // Base API functions for todos
// export async function fetchTodos(userId) {
//   const response = await fetch(`/api/todos?user_id=${userId}`);
//   if (!response.ok) {
//     throw new Error(response.statusText);
//   }
//   return await response.json();
// }

// export async function addTodo(todo) {
//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(todo),
//   };
//   const response = await fetch('/api/todos', options);
//   if (!response.ok) {
//     throw new Error(response.statusText);
//   }
//   return await response.json();
// }

// export async function deleteTodo(todoId, userId) {
//   const options = {
//     method: 'DELETE',
//   };
//   const response = await fetch(
//     `/api/todos/${todoId}?user_id=${userId}`,
//     options
//   );
//   if (!response.ok) {
//     throw new Error(response.statusText);
//   }
//   return await response.json();
// }

// // Steam API endpoints
// export async function fetchTopGames(limit = 15, offset = 0) {
//   try {
//     // Try to fetch from the API
//     const response = await fetch(`/api/steam/top-games?limit=${limit}&offset=${offset}`);
//     if (!response.ok) {
//       console.error('Error fetching top games:', response.status, response.statusText);
//       throw new Error(`Failed to fetch top games: ${response.statusText}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error in fetchTopGames:', error);
//     // If the API call fails, fall back to mock data
//     const storeData = initialState();
//     const allGames = storeData.games.allGames;
//     // Remove the rating filter so you always get enough games
//     const topGames = allGames
//       .sort((a, b) => b.rating - a.rating)
//       .slice(offset, offset + limit);
//     return topGames;
//   }
// }

// export async function fetchDiscountedGames(limit = 15, offset = 0) {
//   try {
//     const response = await fetch(`/api/steam/discounted-games?limit=${limit}&offset=${offset}`);
//     if (!response.ok) {
//       console.error('Error fetching discounted games:', response.status, response.statusText);
//       throw new Error(`Failed to fetch discounted games: ${response.statusText}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error in fetchDiscountedGames:', error);
//     // If the API call fails, fall back to mock data
//     const storeData = initialState();
//     const allGames = storeData.games.allGames;
//     const discountedGames = allGames
//       .filter(game => game.discount && game.discount > 0)
//       .sort((a, b) => b.discount - a.discount)
//       .slice(offset, offset + limit);
//     return discountedGames;
//   }
// }

// export async function fetchFeaturedGames(limit = 10, offset = 0) {
//   try {
//     const response = await fetch(`/api/steam/featured-games?limit=${limit}&offset=${offset}`);
//     if (!response.ok) {
//       console.error('Error fetching featured games:', response.status, response.statusText);
//       throw new Error(`Failed to fetch featured games: ${response.statusText}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error in fetchFeaturedGames:', error);
//     // If the API call fails, fall back to mock data
//     const storeData = initialState();
//     const allGames = storeData.games.allGames;
//     const featuredGames = allGames
//       .filter(game => game.featured === true)
//       .slice(offset, offset + limit);
//     return featuredGames;
//   }
// }

// export async function fetchMoreGames(page = 1, limit = 12, category = 'all') {
//   try {
//     const offset = (page - 1) * limit;
//     // Try to fetch from API
//     try {
//       const response = await fetch(`/api/steam/games?limit=${limit}&offset=${offset}&category=${encodeURIComponent(category)}`);
//       if (response.ok) {
//         return await response.json();
//       }
//     } catch (apiError) {
//       console.error('API fetch failed, falling back to mock data:', apiError);
//     }
    
//     // Fallback to mock data
//     const storeData = initialState();
//     const allGames = storeData.games.allGames;
    
//     // Filter by category if needed
//     const filteredGames = category === 'all' 
//       ? allGames 
//       : allGames.filter(game => game.category && game.category.includes(category));
    
//     // Calculate pagination
//     return filteredGames.slice(offset, offset + limit);
//   } catch (error) {
//     console.error('Error in fetchMoreGames:', error);
//     return [];
//   }
// }

// export async function fetchGameDetails(appId) {
//   try {
//     const response = await fetch(`/api/steam/games/${appId}`);
//     if (!response.ok) {
//       console.error('Error fetching game details:', response.status, response.statusText);
//       throw new Error(`Failed to fetch game details: ${response.statusText}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error in fetchGameDetails:', error);
//     throw error; // Rethrow for this one as we need to handle it in the component
//   }
// }

// export async function searchGames(query, limit = 20) {
//   try {
//     if (!query || query.length < 3) {
//       return [];
//     }
    
//     // Try to fetch from the API first
//     try {
//       const response = await fetch(`/api/steam/search?q=${encodeURIComponent(query)}&limit=${limit}`);
//       if (response.ok) {
//         return await response.json();
//       }
//     } catch (apiError) {
//       console.error('API search failed, falling back to client-side search:', apiError);
//     }
    
//     // Fallback to client-side search if API call fails
//     const storeData = initialState();
//     const allGames = storeData.games.allGames;
    
//     // Create a case-insensitive search that handles partial matches
//     const searchQuery = query.toLowerCase();
    
//     // Enhanced search algorithm with tokenization and scoring
//     const results = allGames
//       .map(game => {
//         // Initialize score
//         let score = 0;
        
//         // Check title match (highest priority)
//         if (game.title.toLowerCase() === searchQuery) {
//           score += 100; // Exact match gets highest score
//         } else if (game.title.toLowerCase().includes(searchQuery)) {
//           score += 50; // Partial match gets medium score
//         }
        
//         // Check individual words in title
//         const titleWords = game.title.toLowerCase().split(/\s+/);
//         const queryWords = searchQuery.split(/\s+/);
        
//         queryWords.forEach(queryWord => {
//           if (queryWord.length >= 3) { // Only consider words with 3+ characters
//             titleWords.forEach(titleWord => {
//               if (titleWord === queryWord) {
//                 score += 30; // Exact word match
//               } else if (titleWord.includes(queryWord)) {
//                 score += 15; // Partial word match
//               }
//             });
//           }
//         });
        
//         // Check description match (lower priority)
//         if (game.description && game.description.toLowerCase().includes(searchQuery)) {
//           score += 20;
//         }
        
//         // Check category match (lowest priority)
//         if (game.category && game.category.toLowerCase().includes(searchQuery)) {
//           score += 10;
//         }
        
//         return { ...game, searchScore: score };
//       })
//       .filter(game => game.searchScore > 0) // Only keep games with a positive score
//       .sort((a, b) => b.searchScore - a.searchScore) // Sort by score (highest first)
//       .slice(0, limit); // Limit results
    
//     return results;
//   } catch (error) {
//     console.error('Error in searchGames:', error);
//     return []; // Return empty array instead of throwing
//   }
// }

// // Cart API functions
// export async function addToCart(gameId, userId) {
//   try {
//     // Ensure we have authentication
//     if (!userId) {
//       throw new Error('User must be logged in to add items to cart');
//     }
    
//     const options = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ 
//         gameId, 
//         userId 
//       }),
//     };
    
//     const response = await fetch('/api/cart/add', options);
    
//     if (!response.ok) {
//       console.error('Error adding to cart:', response.status, response.statusText);
//       throw new Error(`Failed to add item to cart: ${response.statusText}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error in addToCart:', error);
//     throw error; // Rethrow to handle in the component
//   }
// }

// export async function removeFromCart(gameId, userId) {
//   try {
//     // Ensure we have authentication
//     if (!userId) {
//       throw new Error('User must be logged in to remove items from cart');
//     }
    
//     const options = {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     };
    
//     const response = await fetch(`/api/cart/remove/${gameId}?userId=${userId}`, options);
    
//     if (!response.ok) {
//       console.error('Error removing from cart:', response.status, response.statusText);
//       throw new Error(`Failed to remove item from cart: ${response.statusText}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error in removeFromCart:', error);
//     throw error; // Rethrow to handle in the component
//   }
// }

// export async function getCart(userId) {
//   try {
//     // Ensure we have authentication
//     if (!userId) {
//       throw new Error('User must be logged in to view cart');
//     }
    
//     const response = await fetch(`/api/cart?userId=${userId}`);
    
//     if (!response.ok) {
//       console.error('Error fetching cart:', response.status, response.statusText);
//       throw new Error(`Failed to fetch cart: ${response.statusText}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error in getCart:', error);
//     throw error; // Rethrow to handle in the component
//   }
// }

// export async function downloadGame(gameId, userId) {
//   try {
//     // Ensure we have authentication
//     if (!userId) {
//       throw new Error('User must be logged in to download games');
//     }
    
//     const response = await fetch(`/api/steam/download/${gameId}?userId=${userId}`);
    
//     if (!response.ok) {
//       console.error('Error downloading game:', response.status, response.statusText);
//       throw new Error(`Failed to download game: ${response.statusText}`);
//     }
    
//     const gameData = await response.json();
//     return gameData;
//   } catch (error) {
//     console.error('Error in downloadGame:', error);
//     throw error; // Rethrow to handle in the component
//   }
// }


// Import initialState for mock data
import { initialState } from '../store/initialStore.js';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('access_token');
};

// Helper function for authenticated API calls
const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };
  
  return fetch(url, defaultOptions);
};

// Base API functions for todos
export async function fetchTodos(userId) {
  const response = await fetch(`/api/todos?user_id=${userId}`);
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
  const response = await fetch('/api/todos', options);
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
    `/api/todos/${todoId}?user_id=${userId}`,
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
    // Try to fetch from the API
    const response = await fetch(`/api/steam/top-games?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      console.error('Error fetching top games:', response.status, response.statusText);
      throw new Error(`Failed to fetch top games: ${response.statusText}`);
    }
    return await response.json();
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
    const response = await fetch(`/api/steam/discounted-games?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      console.error('Error fetching discounted games:', response.status, response.statusText);
      throw new Error(`Failed to fetch discounted games: ${response.statusText}`);
    }
    return await response.json();
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
    const response = await fetch(`/api/steam/featured-games?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      console.error('Error fetching featured games:', response.status, response.statusText);
      throw new Error(`Failed to fetch featured games: ${response.statusText}`);
    }
    return await response.json();
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
      const response = await fetch(`/api/steam/games?limit=${limit}&offset=${offset}&category=${encodeURIComponent(category)}`);
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
    const response = await fetch(`/api/steam/games/${appId}`);
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
      const response = await fetch(`/api/steam/search?q=${encodeURIComponent(query)}&limit=${limit}`);
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

// ==================== CART API FUNCTIONS ====================

export async function addToCart(gameId, userId) {
  try {
    // Ensure we have authentication
    if (!userId) {
      throw new Error('User must be logged in to add items to cart');
    }
    
    const response = await authenticatedFetch('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ 
        gameId, 
        userId 
      }),
    });
    
    if (!response.ok) {
      console.error('Error adding to cart:', response.status, response.statusText);
      throw new Error(`Failed to add item to cart: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in addToCart:', error);
    throw error; // Rethrow to handle in the component
  }
}

export async function removeFromCart(gameId, userId) {
  try {
    // Ensure we have authentication
    if (!userId) {
      throw new Error('User must be logged in to remove items from cart');
    }
    
    const response = await authenticatedFetch(`/api/cart/remove/${gameId}?userId=${userId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      console.error('Error removing from cart:', response.status, response.statusText);
      throw new Error(`Failed to remove item from cart: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    throw error; // Rethrow to handle in the component
  }
}

export async function getCart(userId) {
  try {
    // Ensure we have authentication
    if (!userId) {
      throw new Error('User must be logged in to view cart');
    }
    
    const response = await authenticatedFetch(`/api/cart?userId=${userId}`);
    
    if (!response.ok) {
      console.error('Error fetching cart:', response.status, response.statusText);
      throw new Error(`Failed to fetch cart: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getCart:', error);
    throw error; // Rethrow to handle in the component
  }
}

export async function clearCart(userId) {
  try {
    if (!userId) {
      throw new Error('User must be logged in to clear cart');
    }
    
    const response = await authenticatedFetch(`/api/cart/clear?userId=${userId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      console.error('Error clearing cart:', response.status, response.statusText);
      throw new Error(`Failed to clear cart: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in clearCart:', error);
    throw error;
  }
}

// ==================== WISHLIST API FUNCTIONS ====================

export async function addToWishlist(userId, gameId) {
  try {
    if (!userId) {
      throw new Error('User must be logged in to add items to wishlist');
    }
    
    const response = await authenticatedFetch(`/user/${userId}/wishlist/add`, {
      method: 'POST',
      body: JSON.stringify({ game_id: gameId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to add to wishlist: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in addToWishlist:', error);
    throw error;
  }
}

export async function removeFromWishlist(userId, gameId) {
  try {
    if (!userId) {
      throw new Error('User must be logged in to remove items from wishlist');
    }
    
    const response = await authenticatedFetch(`/user/${userId}/wishlist/game/${gameId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to remove from wishlist: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in removeFromWishlist:', error);
    throw error;
  }
}

export async function getWishlist(userId) {
  try {
    if (!userId) {
      throw new Error('User must be logged in to view wishlist');
    }
    
    const response = await authenticatedFetch(`/user/${userId}/wishlist`);
    
    if (!response.ok) {
      console.error('Error fetching wishlist:', response.status, response.statusText);
      // Fallback to mock data from initialState
      const storeData = initialState();
      return storeData.user.wishlist || [];
    }
    
    const result = await response.json();
    // Extract game IDs from the response
    if (result.success && result.data) {
      return result.data.map(item => item.id || item.game_id || item);
    }
    return [];
  } catch (error) {
    console.error('Error in getWishlist:', error);
    // Fallback to mock data
    const storeData = initialState();
    return storeData.user.wishlist || [];
  }
}

// ==================== LIBRARY API FUNCTIONS ====================

export async function addToLibrary(userId, gameId) {
  try {
    if (!userId) {
      throw new Error('User must be logged in to add games to library');
    }
    
    const response = await authenticatedFetch(`/user/${userId}/library/add`, {
      method: 'POST',
      body: JSON.stringify({ game_id: gameId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to add to library: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in addToLibrary:', error);
    throw error;
  }
}

export async function getLibrary(userId) {
  try {
    if (!userId) {
      throw new Error('User must be logged in to view library');
    }
    
    const response = await authenticatedFetch(`/user/${userId}/library`);
    
    if (!response.ok) {
      console.error('Error fetching library:', response.status, response.statusText);
      // Fallback to mock data from initialState
      const storeData = initialState();
      return storeData.user.library || [];
    }
    
    const result = await response.json();
    // Extract game IDs from the response
    if (result.success && result.data) {
      return result.data.map(item => item.id || item.game_id || item);
    }
    return [];
  } catch (error) {
    console.error('Error in getLibrary:', error);
    // Fallback to mock data
    const storeData = initialState();
    return storeData.user.library || [];
  }
}

export async function removeFromLibrary(userId, gameId) {
  try {
    if (!userId) {
      throw new Error('User must be logged in to remove games from library');
    }
    
    const response = await authenticatedFetch(`/user/${userId}/library/game/${gameId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to remove from library: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in removeFromLibrary:', error);
    throw error;
  }
}

// ==================== UNIFIED SERVICE FUNCTIONS ====================
// High-level functions that handle events and state management

export async function addGameToWishlist(userId, gameId) {
  try {
    await addToWishlist(userId, gameId);
    
    // Dispatch event to update UI
    window.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { gameId, action: 'add', userId }
    }));
    
    return true;
  } catch (error) {
    console.error('Error adding game to wishlist:', error);
    throw error;
  }
}

export async function removeGameFromWishlist(userId, gameId) {
  try {
    await removeFromWishlist(userId, gameId);
    
    // Dispatch event to update UI
    window.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { gameId, action: 'remove', userId }
    }));
    
    return true;
  } catch (error) {
    console.error('Error removing game from wishlist:', error);
    throw error;
  }
}

export async function addGameToCart(userId, gameId) {
  try {
    await addToCart(gameId, userId);
    
    // Dispatch event to update UI
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { gameId, action: 'add', userId }
    }));
    
    return true;
  } catch (error) {
    console.error('Error adding game to cart:', error);
    throw error;
  }
}

export async function removeGameFromCart(userId, gameId) {
  try {
    await removeFromCart(gameId, userId);
    
    // Dispatch event to update UI
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { gameId, action: 'remove', userId }
    }));
    
    return true;
  } catch (error) {
    console.error('Error removing game from cart:', error);
    throw error;
  }
}

export async function addGamesToLibrary(userId, gameIds) {
  try {
    // Add games one by one since the API expects single game_id
    for (const gameId of gameIds) {
      await addToLibrary(userId, gameId);
    }
    
    // Dispatch event to update UI
    window.dispatchEvent(new CustomEvent('libraryUpdated', {
      detail: { gameIds, action: 'add', userId }
    }));
    
    return true;
  } catch (error) {
    console.error('Error adding games to library:', error);
    throw error;
  }
}

// ==================== EXISTING FUNCTIONS ====================

export async function downloadGame(gameId, userId) {
  try {
    // Ensure we have authentication
    if (!userId) {
      throw new Error('User must be logged in to download games');
    }
    
    const response = await fetch(`/api/steam/download/${gameId}?userId=${userId}`);
    
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