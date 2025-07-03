/**
 * Reducer function to manage the state.
 *
 * @returns {Object} The new state after the action has been applied.
 *
 * @note The structure of the payload is crucial for the correct functioning of this reducer.
 *
 * @example
 * // Adding a task
 * dispatch({ type: 'ADD_TASK', payload: { task: 'New Task' } });
 *
 * @example
 * // Deleting a task
 * dispatch({ type: 'DELETE_TASK', payload: { id: 'task-id' } });
 *
 * @adjustment To adjust this reducer for your project's needs, ensure that the action types and payload structures match your specific requirements.
 *
 * @author dmytro-ch21
 */
export function storeReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      console.log("[DEBUG] LOGIN action payload:", action.payload);
      const newUser = {
        ...action.payload.user,
        isAuthenticated: true,
        token: action.payload.token,
        userId: action.payload.user.id || action.payload.user.userId,
      };
      return {
        ...state,
        user: newUser,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: {
          isAuthenticated: false,
          username: '',
          email: '',
          avatar: '',
          token: null,
          userId: null,
        },
        wishlist: {
          items: [],
          loading: false,
        },
        cart: {
          items: [],
          loading: false,
        },
        library: {
          items: [],
          loading: false,
        },
      };
    case 'SET_WISHLIST':
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          items: action.payload.items,
        },
      };
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          items: [...state.wishlist.items, action.payload.gameId],
        },
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          items: state.wishlist.items.filter(id => id !== action.payload.gameId),
        },
      };
    case 'SET_LIBRARY':
      return {
        ...state,
        library: {
          ...state.library,
          items: action.payload.items,
        },
      };
    case 'SET_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: action.payload.items,
        },
      };
    case 'ADD_TO_CART':
      const existingCartItems = state.cart?.items || [];
      const existingCartItem = existingCartItems.find(item => item.gameId === action.payload.gameId);
      
      if (existingCartItem) {
        return {
          ...state,
          cart: {
            ...state.cart,
            items: existingCartItems.map(item =>
              item.gameId === action.payload.gameId
                ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
                : item
            ),
          },
        };
      } else {
        return {
          ...state,
          cart: {
            ...state.cart,
            items: [...existingCartItems, {
              gameId: action.payload.gameId,
              quantity: action.payload.quantity || 1
            }],
          },
        };
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: (state.cart?.items || []).filter(item => item.gameId !== action.payload.gameId),
        },
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: (state.cart?.items || []).map(item =>
            item.gameId === action.payload.gameId
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        },
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [],
        },
      };
    default:
      return state;
  }
}
