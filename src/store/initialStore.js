/**
 * @file initialState.js
 * @description This file defines the initial state of the application store in a Flux architecture.
 * The initial state is an object that holds the default values for the application's state.
 * It is used by the store to initialize its state and can be referenced throughout the application
 * to reset or compare the current state.
 *
 * The initial state object for the Redux store.
 *
 * This object defines the default state of the application before any actions are dispatched.
 *
 * Usage:
 * - Import this initialState object into your store configuration.
 * - Use it to set up the default state for your reducers.
 *
 * What is a slice:
 * - A slice is a portion of the initial state that is managed by a specific reducer.
 * - Each slice typically corresponds to a specific feature or domain in your application.
 *
 * How to adjust for your needs:
 * - Add properties to this object to define the initial state for different slices of your application.
 * - Ensure that each property corresponds to a slice managed by a reducer.
 *
 * @example:
 * const initialState = {
 *   user: {
 *     isAuthenticated: false,
 *     details: null,
 *   },
 *   posts: {
 *     list: []
 *   },
 * };
 *
 * @author dmytro-ch21
 */
export const initialState = () => ({
  // User authentication and profile data
  user: {
    isAuthenticated: true, // Default should be false, set to true for demo
    userId: 1,
    username: "PlayerOne",
    email: "player@playheaven.com",
    avatar: "/assets/avatar-placeholder.png",
    wishlist: [2, 5, 8], // Array of game IDs in user's wishlist
    cart: [], // Array of game IDs in cart
    library: [1, 3], // Array of owned game IDs
  },

  // Games catalog data - matches backend structure
  games: {
    allGames: [
      {
        id: 1,
        title: "Cyberpunk Odyssey",
        price: "49.99",
        release_year: 2024,
        status: "released",
        category: "Action",
        description: "An immersive cyberpunk adventure set in a dystopian future where technology and humanity collide. Experience cutting-edge graphics and deep storytelling.",
        platform: ["windows", "linux", "ios"],
        rating: 9.2,
        image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop",
        discount: 17,
        original_price: "59.99",
        featured: true,
        new_release: false
      },
      {
        id: 2,
        title: "Stellar Conquest",
        price: "29.99",
        release_year: 2024,
        status: "released",
        category: "Strategy",
        description: "A space strategy game where you build and command fleets across the galaxy. Conquer planets and forge your empire among the stars.",
        platform: ["windows", "mac"],
        rating: 8.7,
        image_url: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=250&fit=crop",
        featured: true,
        new_release: true
      },
      {
        id: 3,
        title: "Arcane Legacy",
        price: "39.99",
        release_year: 2024,
        status: "released",
        category: "RPG",
        description: "A magical adventure RPG with stunning visuals and an epic quest. Discover ancient secrets and master powerful spells.",
        platform: ["windows", "ios", "linux"],
        rating: 9.5,
        image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop",
        discount: 20,
        original_price: "49.99",
        featured: true,
        new_release: false
      },
      {
        id: 4,
        title: "Velocity Apex",
        price: "34.99",
        release_year: 2024,
        status: "released",
        category: "Racing",
        description: "High-speed racing with cutting-edge graphics and realistic physics. Feel the adrenaline rush of professional motorsport.",
        platform: ["windows", "ios"],
        rating: 8.3,
        image_url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=250&fit=crop",
        new_release: true
      },
      {
        id: 5,
        title: "Urban Warfare",
        price: "44.99",
        release_year: 2024,
        status: "released",
        category: "Action",
        description: "Tactical urban combat simulator with realistic mechanics. Master modern warfare in detailed city environments.",
        platform: ["windows", "linux"],
        rating: 8.9,
        image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=250&fit=crop",
        discount: 18,
        original_price: "54.99",
        new_release: true
      },
      {
        id: 6,
        title: "Mystic Realms",
        price: "27.99",
        release_year: 2024,
        status: "released",
        category: "Adventure",
        description: "Fantasy world exploration with magical creatures and ancient mysteries. Embark on a journey through enchanted lands.",
        platform: ["windows", "mac", "linux"],
        rating: 8.1,
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
        new_release: true
      },
      {
        id: 7,
        title: "Quantum Shift",
        price: "52.99",
        release_year: 2024,
        status: "released",
        category: "Sci-Fi",
        description: "Mind-bending puzzle adventure through multiple dimensions. Manipulate reality and solve complex quantum mechanics puzzles.",
        platform: ["windows", "mac"],
        rating: 9.0,
        image_url: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=250&fit=crop",
        discount: 25,
        original_price: "69.99"
      },
      {
        id: 8,
        title: "Dragon's Crown",
        price: "41.99",
        release_year: 2024,
        status: "released",
        category: "RPG",
        description: "Epic fantasy RPG with dragons, magic, and legendary quests. Build your character and save the kingdom from ancient evil.",
        platform: ["windows", "ios", "linux"],
        rating: 9.3,
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
        discount: 15,
        original_price: "49.99"
      },
      {
        id: 9,
        title: "Neon Streets",
        price: "24.99",
        release_year: 2024,
        status: "released",
        category: "Action",
        description: "Retro-futuristic action game with synthwave aesthetics. Fight through neon-lit streets in this stylish adventure.",
        platform: ["windows", "linux"],
        rating: 7.8,
        image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop"
      },
      {
        id: 10,
        title: "Ocean Depths",
        price: "36.99",
        release_year: 2024,
        status: "released",
        category: "Simulation",
        description: "Deep sea exploration and survival simulator. Discover the mysteries of the ocean depths and manage underwater bases.",
        platform: ["windows", "mac", "linux"],
        rating: 8.5,
        image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop",
        discount: 30,
        original_price: "52.99"
      }
    ],
    
    // Filtered game lists for easy access
    featuredGames: [], // Will be populated by selectors
    newReleases: [], // Will be populated by selectors
    specialOffers: [], // Will be populated by selectors
    
    // Game browsing state
    searchQuery: "",
    selectedCategory: "all",
    sortBy: "popularity", // popularity, price_low, price_high, rating, release_date
    filters: {
      platforms: [],
      priceRange: [0, 100],
      rating: 0,
      categories: []
    },
    
    // Loading states
    loading: false,
    error: null
  },

  // Shopping cart
  cart: {
    items: [], // Array of {gameId, quantity, price}
    totalAmount: 0,
    itemCount: 0,
    isOpen: false
  },

  // User wishlist
  wishlist: {
    items: [], // Array of game IDs
    loading: false
  },

  // Application UI state
  ui: {
    theme: "dark", // dark, light
    language: "en",
    currency: "USD",
    notifications: [],
    modals: {
      login: false,
      register: false,
      gameDetails: false
    },
    sidebar: {
      isOpen: false
    }
  },

  // Game categories for navigation
  categories: [
    { id: "action", name: "Action", icon: "🎯" },
    { id: "adventure", name: "Adventure", icon: "🗺️" },
    { id: "rpg", name: "RPG", icon: "⚔️" },
    { id: "strategy", name: "Strategy", icon: "🧠" },
    { id: "simulation", name: "Simulation", icon: "🎮" },
    { id: "racing", name: "Racing", icon: "🏎️" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "puzzle", name: "Puzzle", icon: "🧩" },
    { id: "horror", name: "Horror", icon: "👻" },
    { id: "sci-fi", name: "Sci-Fi", icon: "🚀" }
  ],

  // Platform options
  platforms: [
    { id: "windows", name: "Windows", icon: "🪟" },
    { id: "mac", name: "macOS", icon: "🍎" },
    { id: "linux", name: "Linux", icon: "🐧" },
    { id: "ios", name: "iOS", icon: "📱" },
    { id: "android", name: "Android", icon: "🤖" }
  ]
});
