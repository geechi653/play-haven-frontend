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
    default:
      return state;
  }
}
