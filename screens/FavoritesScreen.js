import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, FlatList, Platform } from 'react-native';
import { Text, Title, IconButton, Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FavoritesContext } from '../components/FavoritesContext';
import i18n from '../i18n';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const openDetail = (book) => {
    setSelectedBook(book);
    setShowDetail(true);
  };
  const closeDetail = () => {
    setShowDetail(false);
    setSelectedBook(null);
  };

  const renderBook = ({ item }) => (
    <Card style={styles.bookCard} mode="elevated">
      <View style={styles.cardRow}>
        <Image source={{ uri: item.cover }} style={styles.coverImg} />
        <View style={styles.infoCol}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookSummary} numberOfLines={2}>{item.summary}</Text>
          <View style={styles.cardActions}>
            <Button mode="text" compact icon="eye-outline" textColor="#7F7FD5" style={styles.actionBtn} onPress={() => openDetail(item)}>{i18n.t('details')}</Button>
            <IconButton icon="heart" size={22} style={styles.favBtnActive} onPress={() => toggleFavorite(item)} iconColor="#7F7FD5" />
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <Title style={styles.title}>{i18n.t('favorites')}</Title>
        <MaterialCommunityIcons name="heart" size={28} color="#7F7FD5" />
      </View>
      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="heart-off-outline" size={64} color="#d1d5e6" />
          <Text style={styles.emptyText}>{i18n.t('no_favorites')}</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderBook}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* Detay Modalı */}
      {selectedBook && (
        <View style={[styles.detailModalOverlay, showDetail ? {display:'flex'} : {display:'none'}]}>
          <View style={styles.detailModalCard}>
            <IconButton icon="close" size={28} style={styles.detailCloseBtn} onPress={closeDetail} />
            <Image source={{ uri: selectedBook.cover }} style={styles.detailBookCover} />
            <Text style={styles.detailBookTitle}>{selectedBook.title}</Text>
            <Text style={styles.detailBookAuthor}>{selectedBook.author} • {selectedBook.year}</Text>
            <View style={styles.detailSummaryBox}>
              <Text style={styles.detailSummaryText}>{selectedBook.summary}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fafbff',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 32 : 48,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  bookCard: {
    borderRadius: 22,
    marginBottom: 18,
    backgroundColor: '#fff',
    shadowColor: '#7F7FD5',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    padding: 0,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  coverImg: {
    width: 64,
    height: 90,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#f0f0f0',
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  bookSummary: {
    color: '#7F7FD5',
    fontSize: 14,
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  actionBtn: {
    marginRight: 2,
    borderRadius: 12,
    paddingHorizontal: 0,
  },
  favBtnActive: {
    marginLeft: 2,
    backgroundColor: '#f3f4fa',
    borderRadius: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  emptyText: {
    color: '#b0b5c9',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  detailModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30,30,40,0.18)',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailModalCard: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
    shadowColor: '#7F7FD5',
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 16,
    position: 'relative',
  },
  detailCloseBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  detailBookCover: {
    width: 160,
    height: 220,
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 8,
    resizeMode: 'cover',
    shadowColor: '#7F7FD5',
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  detailBookTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailBookAuthor: {
    fontSize: 16,
    color: '#7F7FD5',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  detailSummaryBox: {
    backgroundColor: '#f3f4fa',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 0,
    width: '100%',
  },
  detailSummaryText: {
    color: '#444',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.1,
  },
}); 