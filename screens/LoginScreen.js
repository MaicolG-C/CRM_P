import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AuthImageSection from '../components/auth/AuthImageSection';
import LoginForm from '../components/auth/LoginForm';

const LoginScreen = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.wrapper}>
        <View style={styles.leftSection}>
          <AuthImageSection />
        </View>
        <View style={styles.rightSection}>
          <LoginForm />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    width: Platform.OS === 'web' ? '100vw' : '100%',
    height: Platform.OS === 'web' ? '100vh' : '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    boxShadow: Platform.OS === 'web' ? '0 2px 16px rgba(0,0,0,0.08)' : undefined,
  },
  leftSection: {
    flex: 1,
    backgroundColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightSection: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: Platform.OS === 'web' ? '0 2px 8px rgba(0,0,0,0.05)' : undefined,
  },
});

export default LoginScreen;