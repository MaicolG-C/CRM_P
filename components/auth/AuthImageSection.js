import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const AuthImageSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instituto Superior Tecnológico Quito</Text>
      <Image
        source={require('../../assets/itq1.png')}
        style={styles.mainImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#8B0000',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
  },
  mainImage: {
    width: '100%',
    maxWidth: 320,
    height: 380,
    resizeMode: 'contain',
    borderRadius: 12,
  },
});

export default AuthImageSection;