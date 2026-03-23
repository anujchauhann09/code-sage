import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  theme: 'theme',
  namespace: 'namespace',
};

function readFromStorage(key, fallback) {
  try {
    const value = sessionStorage.getItem(key);
    return value !== null ? value : fallback;
  } catch {
    return fallback;
  }
}

function writeToStorage(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
  }
}

export function AppProvider({ children }) {
  const [namespace, setNamespaceState] = useState('');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const storedTheme = readFromStorage(STORAGE_KEYS.theme, 'dark');
    const storedNamespace = readFromStorage(STORAGE_KEYS.namespace, '');
    setTheme(storedTheme === 'light' ? 'light' : 'dark');
    setNamespaceState(storedNamespace);
  }, []);

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    writeToStorage(STORAGE_KEYS.namespace, namespace);
  }, [namespace]);

  function setNamespace(value) {
    setNamespaceState(value);
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <AppContext.Provider value={{ namespace, setNamespace, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
}
