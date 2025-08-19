
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      navigation.navigate('Dashboard');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Error al iniciar sesión");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.label}>Usuario o Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="tucorreoelectronico@gmail.com"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="********"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialCommunityIcons
            name={showPassword ? 'eye' : 'eye-off'}
            size={22}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
          <Text style={styles.checkboxLabel}>Recordar</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión →</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.createAccount}>¿No tienes una cuenta?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
    padding: 32,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: Platform.OS === 'web' ? '0 2px 8px rgba(0,0,0,0.1)' : undefined,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  eyeButton: {
    marginLeft: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: Platform.OS === 'web' ? 'pointer' : undefined,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    cursor: Platform.OS === 'web' ? 'pointer' : undefined,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#8B0000',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  checkboxChecked: {
    backgroundColor: '#8B0000',
  },
  checkboxLabel: {
    fontSize: 15,
  },
  forgotPassword: {
    color: '#8B0000',
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: '#8B0000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createAccount: {
    textAlign: 'center',
    color: '#8B0000',
    fontSize: 15,
    marginTop: 10,
  },
});

export default LoginForm;