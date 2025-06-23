import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Text, Title, List, Switch, Divider, Button, Avatar, Portal, Dialog, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import { FavoritesContext } from '../components/FavoritesContext';

export default function SettingsScreen() {
  const theme = useTheme();
  const { updateUserEmail } = useContext(FavoritesContext);
  const [auth, setAuth] = useState({ loggedIn: false, email: '', name: '' });
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showProfileHint, setShowProfileHint] = useState(true);

  // Load user data from AsyncStorage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          setAuth(parsed.auth || { loggedIn: false, email: '', name: '' });
          setProfileImage(parsed.profileImage || null);
          setShowProfileHint(!(parsed.profileImage));
        }
      } catch (e) {
        // handle error
      }
    };
    loadUserData();
  }, []);

  // Save user data to AsyncStorage whenever auth or profileImage changes
  useEffect(() => {
    const saveUserData = async () => {
      try {
        await AsyncStorage.setItem('user', JSON.stringify({ auth, profileImage }));
      } catch (e) {
        // handle error
      }
    };
    saveUserData();
  }, [auth, profileImage]);

  const handleAuth = () => {
    if (isRegisterMode) {
      setAuth({ loggedIn: true, email, name });
      updateUserEmail(email);
    } else {
      setAuth({ loggedIn: true, email, name: '' });
      updateUserEmail(email);
    }
    setShowAuthDialog(false);
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleLogout = () => {
    setAuth({ loggedIn: false, email: '', name: '' });
    setProfileImage(null);
    setShowProfileHint(true);
    AsyncStorage.removeItem('user');
    updateUserEmail(null);
  };

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setShowProfileHint(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.headerRow}>
        <Title style={styles.title}>{i18n.t('settings')}</Title>
        <MaterialCommunityIcons name="cog" size={28} color="#7F7FD5" />
      </View>
      {!auth.loggedIn ? (
        <View style={styles.unauthCard}>
          <Avatar.Icon size={64} icon="account-circle" style={{ backgroundColor: '#e0c3fc' }} color="#7F7FD5" />
          <Text style={styles.unauthText}>{i18n.t('login')} / {i18n.t('register')}</Text>
          <View style={styles.unauthBtnRow}>
            <Button
              mode="contained"
              style={styles.authBtn}
              onPress={() => { setShowAuthDialog(true); setIsRegisterMode(false); }}
              icon="login"
            >
              {i18n.t('login')}
            </Button>
            <Button
              mode="outlined"
              style={styles.authBtn}
              onPress={() => { setShowAuthDialog(true); setIsRegisterMode(true); }}
              icon="account-plus"
            >
              {i18n.t('register')}
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickProfileImage} activeOpacity={0.7}>
            {profileImage ? (
              <Avatar.Image size={54} source={{ uri: profileImage }} style={{ backgroundColor: '#7F7FD5' }} />
            ) : (
              <Avatar.Text size={54} label={(auth.name ? auth.name[0] : auth.email[0])?.toUpperCase() || "U"} style={{ backgroundColor: '#7F7FD5' }} />
            )}
          </TouchableOpacity>
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.profileName}>{auth.name ? auth.name : (auth.email.split('@')[0])}</Text>
            <Text style={styles.profileMail}>{auth.email}</Text>
            {showProfileHint && !profileImage && (
              <Text style={styles.profileEditHint}>Tap the avatar to change your profile photo</Text>
            )}
          </View>
        </View>
      )}
      <Divider style={{ marginVertical: 18 }} />
      <List.Section>
        <List.Item
          title={i18n.t('notifications')}
          left={props => <List.Icon {...props} icon="bell-outline" color="#7F7FD5" />}
          right={() => <Switch value={true} disabled color="#7F7FD5" />}
        />
        <List.Item
          title={i18n.t('about')}
          left={props => <List.Icon {...props} icon="information-outline" color="#7F7FD5" />}
        />
      </List.Section>
      {auth.loggedIn && (
        <Button mode="outlined" icon="logout" style={styles.logoutBtn} textColor="#7F7FD5" onPress={handleLogout}>
          {i18n.t('logout')}
        </Button>
      )}

      {/* Auth Dialog */}
      <Portal>
        <Dialog visible={showAuthDialog} onDismiss={() => setShowAuthDialog(false)} style={{ borderRadius: 18 }}>
          <Dialog.Title style={{ textAlign: 'center', color: '#7F7FD5' }}>
            {isRegisterMode ? i18n.t('register') : i18n.t('login')}
          </Dialog.Title>
          <Dialog.Content>
            {isRegisterMode && (
              <TextInput
                label={"Name"}
                value={name}
                onChangeText={setName}
                style={{ marginBottom: 12 }}
                left={<TextInput.Icon name="account" color="#7F7FD5" />}
                autoCapitalize="words"
              />
            )}
            <TextInput
              label={i18n.t('email')}
              value={email}
              onChangeText={setEmail}
              style={{ marginBottom: 12 }}
              left={<TextInput.Icon name="email-outline" color="#7F7FD5" />}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              label={i18n.t('password')}
              value={password}
              onChangeText={setPassword}
              style={{ marginBottom: 12 }}
              left={<TextInput.Icon name="lock-outline" color="#7F7FD5" />}
              secureTextEntry
            />
            <Button
              mode="contained"
              onPress={handleAuth}
              disabled={isRegisterMode ? (!email || !password || !name) : (!email || !password)}
              style={{ borderRadius: 12, marginTop: 8 }}
            >
              {isRegisterMode ? i18n.t('register') : i18n.t('login')}
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 8,
    shadowColor: '#7F7FD5',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  profileName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  profileMail: {
    color: '#7F7FD5',
    fontSize: 14,
    marginTop: 2,
  },
  logoutBtn: {
    marginTop: 32,
    borderRadius: 14,
    borderColor: '#7F7FD5',
    borderWidth: 1.5,
    alignSelf: 'center',
    width: 180,
  },
  unauthCard: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginBottom: 8,
    shadowColor: '#7F7FD5',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  unauthText: {
    fontSize: 17,
    color: '#7F7FD5',
    fontWeight: 'bold',
    marginVertical: 12,
  },
  unauthBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  authBtn: {
    borderRadius: 14,
    marginHorizontal: 4,
  },
  profileEditHint: {
    color: '#b0b5c9',
    fontSize: 12,
    marginTop: 4,
  },
}); 