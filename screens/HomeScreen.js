import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Text, Title, Button, Portal, Dialog, Paragraph, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FavoritesContext } from '../components/FavoritesContext';
import i18n from '../i18n';

export default function HomeScreen() {
  const [image, setImage] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  // Dummy AI özet
  const [summary, setSummary] = useState('"Bu kitap zenginlik, aşk ve trajediyi konu alır..." (AI özet dummy)');
  const navigation = useNavigation();
  const { addBook } = useContext(FavoritesContext);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Burada AI özet API çağrısı yapılabilir
      setShowDialog(true);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Kamera izni gerekli!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Burada AI özet API çağrısı yapılabilir
      setShowDialog(true);
    }
  };

  const handleAddBook = () => {
    // Kitap objesi oluştur
    const newBook = {
      id: Date.now().toString(),
      title: 'AI Kitap', // İleride OCR veya kullanıcıdan alınabilir
      author: 'Bilinmiyor', // Kullanıcıdan alınabilir veya AI'dan
      year: '2024', // Varsayılan yıl
      cover: image,
      summary: summary,
    };
    addBook(newBook);
    setShowDialog(false);
    setImage(null);
    // Kütüphane sekmesine yönlendir
    navigation.navigate('Main', { screen: 'Library' });
  };

  const handleDialogDismiss = () => {
    setShowDialog(false);
    setImage(null);
    setSummary('"Bu kitap zenginlik, aşk ve trajediyi konu alır..." (AI özet dummy)');
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#e0c3fc", "#8ec5fc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerCard}
      >
        <View style={styles.headerRow}>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="book-open-page-variant" size={28} color="#fff" />
          </View>
          <IconButton icon="bell-outline" size={24} onPress={() => {}} style={styles.headerIcon} />
        </View>
        <Text style={styles.greeting}><Text style={styles.greetingBold}>{i18n.t('welcome')}</Text> <Text style={{fontSize:18}}>👋</Text></Text>
        <Text style={styles.title}>{i18n.t('home_title')}</Text>
        <Text style={styles.subtitle}>{i18n.t('home_subtitle')}</Text>
      </LinearGradient>
      <LinearGradient
        colors={["#7F7FD5", "#86A8E7", "#91EAE4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {!image ? (
          <View style={styles.cardContent}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="image-plus" size={48} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>{i18n.t('add_cover')}</Text>
            <Text style={styles.cardDesc}>{i18n.t('cover_desc')}</Text>
            <View style={styles.buttonCol}>
              <Button
                icon={({size, color}) => <MaterialCommunityIcons name="image" size={22} color={color} />}
                mode="outlined"
                onPress={pickImage}
                style={styles.fullButton}
                labelStyle={styles.buttonLabel}
                textColor="#fff"
                contentStyle={styles.buttonContent}
              >
                {i18n.t('upload_gallery')}
              </Button>
              <Button
                icon={({size, color}) => <MaterialCommunityIcons name="camera" size={22} color={"#7F7FD5"} />}
                mode="contained"
                onPress={takePhoto}
                style={[styles.fullButton, styles.buttonFilled]}
                labelStyle={[styles.buttonLabel, {color:'#7F7FD5'}]}
                textColor="#7F7FD5"
                contentStyle={styles.buttonContent}
              >
                {i18n.t('take_photo')}
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.cardContent}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
          </View>
        )}
      </LinearGradient>
      <Portal>
        <Dialog visible={showDialog} onDismiss={handleDialogDismiss} style={[styles.dialog, {padding:0, overflow:'hidden'}]}>
          <View style={styles.dialogHeaderRow}>
            <Text style={styles.dialogTitleModern}>{i18n.t('ai_analysis')}</Text>
            <IconButton icon="close" size={24} onPress={handleDialogDismiss} style={styles.dialogCloseModern} />
          </View>
          <View style={styles.dialogContentModern}>
            {image && (
              <View style={styles.coverShadowBox}>
                <Image source={{ uri: image }} style={styles.dialogBookCover} />
              </View>
            )}
            <View style={styles.aiSummaryBox}>
              <Text style={styles.aiSummaryText}>{summary}</Text>
            </View>
            <Button mode="contained" style={styles.addButtonModern} labelStyle={styles.addButtonLabelModern} onPress={handleAddBook}>
              {i18n.t('add_to_library')}
            </Button>
          </View>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fafbff',
    paddingHorizontal: 0,
    paddingTop: Platform.OS === 'android' ? 36 : 54,
  },
  headerCard: {
    borderRadius: 32,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 18,
    padding: 24,
    shadowColor: '#b39ddb',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
    alignItems: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7F7FD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  greeting: {
    fontSize: 17,
    color: '#7F7FD5',
    fontWeight: '600',
    marginBottom: 2,
    marginLeft: 2,
    marginTop: 2,
  },
  greetingBold: {
    fontWeight: 'bold',
    color: '#7F7FD5',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    marginLeft: 2,
    marginTop: 2,
  },
  subtitle: {
    color: '#7F7FD5',
    fontSize: 14,
    marginBottom: 2,
    marginLeft: 2,
    marginTop: 2,
  },
  card: {
    borderRadius: 32,
    padding: 32,
    marginHorizontal: 16,
    marginBottom: 18,
    shadowColor: '#7F7FD5',
    shadowOpacity: 0.13,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    minHeight: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDesc: {
    color: '#e6eaff',
    fontSize: 14,
    marginBottom: 22,
    textAlign: 'center',
  },
  buttonCol: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  fullButton: {
    borderRadius: 16,
    width: '100%',
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: 0,
    borderWidth: 1.5,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  buttonFilled: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  buttonLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  imagePreview: {
    width: 180,
    height: 240,
    borderRadius: 18,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fafafa',
    alignSelf: 'center',
  },
  dialog: {
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 0,
  },
  dialogHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 0,
    position: 'relative',
  },
  dialogTitleModern: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7F7FD5',
    letterSpacing: 0.2,
    flex: 1,
    textAlign: 'center',
  },
  dialogCloseModern: {
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
    alignSelf: 'flex-start',
    position: 'absolute',
    right: 8,
    top: 2,
  },
  dialogContentModern: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 32,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  coverShadowBox: {
    shadowColor: '#7F7FD5',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderRadius: 16,
    marginBottom: 18,
    backgroundColor: '#fff',
  },
  dialogBookCover: {
    width: 140,
    height: 190,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  aiSummaryBox: {
    backgroundColor: '#f3f4fa',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 22,
    width: '100%',
    shadowColor: '#7F7FD5',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  aiSummaryText: {
    color: '#444',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  addButtonModern: {
    borderRadius: 16,
    width: '100%',
    backgroundColor: '#7F7FD5',
    shadowColor: '#7F7FD5',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginTop: 2,
    minHeight: 48,
    justifyContent: 'center',
  },
  addButtonLabelModern: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.2,
  },
}); 