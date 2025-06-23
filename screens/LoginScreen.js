import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from '../i18n';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.headerRow}>
        <Title style={styles.title}>{i18n.t('login')}</Title>
        <MaterialCommunityIcons name="login" size={28} color="#7F7FD5" />
      </View>
      <TextInput
        label={i18n.t('email')}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        left={<TextInput.Icon name="email-outline" color="#7F7FD5" />}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label={i18n.t('password')}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        left={<TextInput.Icon name="lock-outline" color="#7F7FD5" />}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
        disabled={!email || !password}
      >
        {i18n.t('login')}
      </Button>
      <Text style={styles.footer}>© 2024 BookLens</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  footer: {
    textAlign: 'center',
    marginTop: 32,
    color: '#aaa',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
}); 