import { createContext, useReducer, useEffect } from 'react';
import { initialState } from './initialStore.js';
import { storeReducer } from './storeReducer.js';

// eslint-disable-next-line
export const StoreContext = createContext(null);

function getInitialStore() {
  const local = localStorage.getItem('playheaven-store');
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return initialState();
    }
  }
  return initialState();
}

export function StoreProvider({ children }) {
  const [store, dispatch] = useReducer(storeReducer, getInitialStore());

  useEffect(() => {
    localStorage.setItem('playheaven-store', JSON.stringify(store));
  }, [store]);

  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}
