import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const steps = [
  'Valida tu Correo',
  'Habla un poco de ti',
  'Sobre tu empresa',
  'Registro Exitoso',
];

const RegisterProgress = ({ currentStep }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Empecemos</Text>
    <View style={styles.stepsContainer}>
      {steps.map((step, idx) => (
        <View key={step} style={styles.stepRow}>
          <View
            style={[
              styles.circle,
              idx < currentStep
                ? styles.circleCompleted
                : idx === currentStep
                ? styles.circleActive
                : styles.circleInactive,
            ]}
          >
            {idx < currentStep ? (
              <MaterialCommunityIcons name="check" size={22} color="#fff" />
            ) : (
              <Text style={styles.circleText}>{idx + 1}</Text>
            )}
          </View>
          <Text
            style={[
              styles.stepText,
              idx === currentStep
                ? styles.stepTextActive
                : idx < currentStep
                ? styles.stepTextCompleted
                : styles.stepTextInactive,
            ]}
          >
            {step}
          </Text>
          {idx < steps.length - 1 && (
            <View style={styles.verticalLine} />
          )}
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B0000',
    padding: 32,
    alignItems: 'flex-start',
    minWidth: 220,
    maxWidth: 300,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  stepsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    position: 'relative',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
  },
  circleActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  circleCompleted: {
    backgroundColor: '#8B0000',
    borderColor: '#fff',
  },
  circleInactive: {
    backgroundColor: '#8B0000',
    borderColor: '#ccc',
  },
  circleText: {
    color: '#8B0000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepText: {
    fontSize: 16,
  },
  stepTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepTextCompleted: {
    color: '#fff',
    opacity: 1,
    fontWeight: 'bold',
  },
  stepTextInactive: {
    color: '#fff',
    opacity: 0.4,
  },
  verticalLine: {
    position: 'absolute',
    left: 13,
    top: 28,
    width: 2,
    height: 28,
    backgroundColor: '#fff',
    zIndex: -1,
  },
});

export default RegisterProgress;