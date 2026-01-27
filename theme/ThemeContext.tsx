import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        return storedTheme;
      }
      return 'system';
    } catch (error) {
      return 'system';
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Function to determine actual theme based on 'system' preference
  const getSystemTheme = useCallback(() => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(getSystemTheme());
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
       if (theme === 'system') {
         setResolvedTheme(getSystemTheme());
       }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, getSystemTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        console.error("Could not save theme to localStorage", error);
    }
  }, [theme, resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};