import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import RegisterProgress from '../components/auth/RegisterProgress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const RegisterScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // Paso 1
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+593');

  // Paso 2
  const [serviceUse, setServiceUse] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [hasExperience, setHasExperience] = useState(null);

  // Paso 3
  const [companyName, setCompanyName] = useState('');
  const [businessArea, setBusinessArea] = useState('');
  const [teamSize, setTeamSize] = useState('');

  // Avanzar y retroceder pasos
  const nextStep = () => setCurrentStep((step) => Math.min(step + 1, 3));
  const prevStep = () => setCurrentStep((step) => Math.max(step - 1, 0));

  // Renderizar contenido según el paso
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View>
            <Text style={styles.step}>PASO 1/3</Text>
            <Text style={styles.title}>Validar el Correo</Text>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="tucorreoelectronico@gmail.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Text style={styles.label}>Crea una Contraseña</Text>
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
            <Text style={styles.label}>Confirma tu Contraseña</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="********"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? 'eye' : 'eye-off'}
                  size={22}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Número de Teléfono</Text>
            <View style={styles.phoneRow}>
              <TextInput
                style={styles.countryInput}
                value={countryCode}
                onChangeText={setCountryCode}
                maxLength={4}
              />
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="987654321"
                placeholderTextColor="#888"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.buttonRow}>
              <View style={{ flex: 1 }} />
              <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                <Text style={styles.nextButtonText}>Siguiente →</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 1:
        return (
          <View>
            <Text style={styles.step}>PASO 2/3</Text>
            <Text style={styles.title}>Habla un poco de ti</Text>
            <Text style={styles.label}>¿Por qué utilizarás el servicio?</Text>
            <TextInput
              style={styles.input}
              placeholder="Trabajo"
              placeholderTextColor="#888"
              value={serviceUse}
              onChangeText={setServiceUse}
            />
            <Text style={styles.label}>¿Cuál es el cargo que ocuparás?</Text>
            <TextInput
              style={styles.input}
              placeholder="Administrador"
              placeholderTextColor="#888"
              value={jobTitle}
              onChangeText={setJobTitle}
            />
            <Text style={styles.label}>¿Tienes experiencia previa con plataformas similares?</Text>
            <View style={styles.radioRow}>
              <TouchableOpacity onPress={() => setHasExperience(true)} style={styles.radioButton}>
                <View style={[styles.radioCircle, hasExperience === true && styles.radioSelected]} />
                <Text style={styles.radioLabel}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setHasExperience(false)} style={styles.radioButton}>
                <View style={[styles.radioCircle, hasExperience === false && styles.radioSelected]} />
                <Text style={styles.radioLabel}>No</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                <Text style={styles.buttonText}>← Anterior</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                <Text style={styles.nextButtonText}>Siguiente →</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.step}>PASO 3/3</Text>
            <Text style={styles.title}>Cuéntanos sobre tu empresa</Text>
            <Text style={styles.label}>El nombre de tu empresa</Text>
            <TextInput
              style={styles.input}
              placeholder="Empresa"
              placeholderTextColor="#888"
              value={companyName}
              onChangeText={setCompanyName}
            />
            <Text style={styles.label}>Dirección de Negocios</Text>
            <TextInput
              style={styles.input}
              placeholder="Admisiones"
              placeholderTextColor="#888"
              value={businessArea}
              onChangeText={setBusinessArea}
            />
            <Text style={styles.label}>¿Cuántas personas trabajan en tu equipo?</Text>
            <View style={styles.teamRow}>
              {['Solo yo', '2 - 5', '6 - 10', '11-20', '21-40', '41-50', '51-100', '101-500'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.teamButton,
                    teamSize === size && styles.teamButtonSelected,
                  ]}
                  onPress={() => setTeamSize(size)}
                >
                  <Text
                    style={[
                      styles.teamButtonText,
                      teamSize === size && styles.teamButtonTextSelected,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                <Text style={styles.buttonText}>← Anterior</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                <Text style={styles.nextButtonText}>Siguiente →</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.successContainer}>
            <Image
              source={require('../assets/check.png')}
              style={styles.successImage}
            />
            <Text style={styles.successText}>¡Te has registrado correctamente!</Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.nextButtonText}>Comenzar →</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.leftSection}>
        <RegisterProgress currentStep={currentStep} />
      </View>
      <View style={styles.rightSection}>
        {renderStepContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    width: '100%',
    height: Platform.OS === 'web' ? '100vh' : '100%',
    backgroundColor: '#f5f7fa',
  },
  leftSection: {
    flex: 1,
    maxWidth: 300,
    backgroundColor: '#8B0000',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  rightSection: {
    flex: 3,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  step: {
    color: '#8B0000',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
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
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  countryInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    width: 70,
    marginRight: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  nextButton: {
    backgroundColor: '#8B0000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 120,
    marginLeft: 8,
    boxShadow: Platform.OS === 'web' ? '0 2px 8px rgba(0,0,0,0.1)' : undefined,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  prevButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8B0000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 120,
    marginRight: 8,
  },
  buttonText: {
    color: '#8B0000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#8B0000',
    marginRight: 6,
    backgroundColor: '#fff',
  },
  radioSelected: {
    backgroundColor: '#8B0000',
  },
  radioLabel: {
    fontSize: 15,
    color: '#333',
  },
  teamRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  teamButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 4,
    backgroundColor: '#fafafa',
  },
  teamButtonSelected: {
    backgroundColor: '#8B0000',
    borderColor: '#8B0000',
  },
  teamButtonText: {
    color: '#333',
    fontSize: 15,
  },
  teamButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  successImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default RegisterScreen;