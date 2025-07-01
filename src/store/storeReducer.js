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
      return {
        ...state,
        user: {
          ...action.payload.user,
          isAuthenticated: true,
        },
      };
    case 'LOGOUT':
      return {
        ...state,
        user: {
          isAuthenticated: false,
          username: '',
          email: '',
          avatar: '',
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
    default:
      return state;
  }
}
