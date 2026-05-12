import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { storage, UserData } from '../storage/storage';
import Logo from '../components/Logo';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return;
    }

    setIsLoading(true);

    try {
      const userData: UserData = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim() || undefined,
        createdAt: new Date().toISOString(),
        preferences: {},
      };

      await storage.saveUserData(userData);
      
      // Petit délai pour montrer le succès
      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'enregistrer vos informations");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Logo size={100} style={styles.logo} />
        
        <Text style={styles.welcomeTitle}>Bienvenue !</Text>
        <Text style={styles.subtitle}>
          Configurez votre application de déverrouillage magique
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Votre nom *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Jean Dupont"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Email (optionnel)</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="jean@exemple.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Commencer l'aventure</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>
          Vos informations sont stockées localement sur votre appareil
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  logo: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#2C3E50',
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 12,
    color: '#95A5A6',
    textAlign: 'center',
  },
});

export default OnboardingScreen;