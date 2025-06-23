import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './navigation/MainNavigator';
import { FavoritesProvider } from './components/FavoritesContext';
import i18n from './i18n';

export default function App() {
  return (
    <FavoritesProvider>
      <PaperProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </PaperProvider>
    </FavoritesProvider>
  );
}
