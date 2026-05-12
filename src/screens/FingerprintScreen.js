@"
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ChibiAnimation from '../components/ChibiAnimation';
import biometricService from '../utils/biometrics';

const FingerprintScreen = ({ navigation, route }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const returnTo = route.params?.returnTo || 'Settings';

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await biometricService.isAvailable();
    setIsBiometricAvailable(available);
    if (!available) {
      Alert.alert(
        'Non disponible',
        'Votre appareil ne supporte pas l\'authentification biométrique',
        [{ text: 'Retour', onPress: () => navigation.goBack() }]
      );
    }
  };

  const handleAuthenticate = async () => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    setShowAnimation(true);

    setTimeout(async () => {
      const { success, error } = await biometricService.authenticate();

      setShowAnimation(false);
      setIsAuthenticating(false);

      if (success) {
        Alert.alert(
          '✅ Succès',
          'Authentification réussie !',
          [
            {
              text: 'OK',
              onPress: () => {
                if (returnTo === 'Settings') {
                  navigation.navigate('Settings');
                } else {
                  navigation.goBack();
                }
              },
            },
          ]
        );
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          Alert.alert(
            '❌ Trop de tentatives',
            'Vous avez dépassé le nombre de tentatives autorisées.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        } else {
          Alert.alert(
            '❌ Échec',
            `Authentification échouée. Il vous reste ${3 - newAttempts} tentative(s).`,
            [{ text: 'Réessayer', onPress: () => {} }]
          );
        }
      }
    }, 1500);
  };

  if (!isBiometricAvailable) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          L'authentification biométrique n'est pas disponible sur cet appareil
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Déverrouillage par empreinte</Text>

      <Text style={styles.subtitle}>
        Utilisez votre empreinte digitale pour vous authentifier
      </Text>

      <ChibiAnimation
        visible={showAnimation}
        size={250}
        message="Vérification de votre empreinte..."
      />

      <TouchableOpacity
        style={[styles.button, isAuthenticating && styles.buttonDisabled]}
        onPress={handleAuthenticate}
        disabled={isAuthenticating}
      >
        {isAuthenticating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            🔐 Scanner mon empreinte
          </Text>
        )}
      </TouchableOpacity>

      {attempts > 0 && (
        <Text style={styles.attemptsText}>
          Tentatives : {attempts}/3
        </Text>
      )}

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
  },
  attemptsText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 15,
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FingerprintScreen;
"@ | Out-File -FilePath src/screens/FingerprintScreen.js -Encoding UTF8