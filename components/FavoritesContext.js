import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [books, setBooks] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  // Load books and favorites for the current user
  useEffect(() => {
    if (!userEmail) {
      setFavorites([]);
      setBooks([]);
      return;
    }
    const loadData = async () => {
      try {
        const favs = await AsyncStorage.getItem(`favorites_${userEmail}`);
        const bks = await AsyncStorage.getItem(`books_${userEmail}`);
        setFavorites(favs ? JSON.parse(favs) : []);
        setBooks(bks ? JSON.parse(bks) : []);
      } catch (e) {
        // handle error
      }
    };
    loadData();
  }, [userEmail]);

  // Save favorites for the current user
  useEffect(() => {
    if (userEmail) {
      AsyncStorage.setItem(`favorites_${userEmail}`, JSON.stringify(favorites));
    }
  }, [favorites, userEmail]);

  // Save books for the current user
  useEffect(() => {
    if (userEmail) {
      AsyncStorage.setItem(`books_${userEmail}`, JSON.stringify(books));
    }
  }, [books, userEmail]);

  const toggleFavorite = (book) => {
    setFavorites((prev) => {
      const exists = prev.some(fav => fav.id === book.id);
      if (exists) {
        return prev.filter(fav => fav.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
  };

  const addBook = (book) => {
    setBooks((prev) => [book, ...prev]);
  };

  // Call this on login/logout to update the current user
  const updateUserEmail = (email) => {
    setUserEmail(email);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, books, addBook, updateUserEmail }}>
      {children}
    </FavoritesContext.Provider>
  );
}