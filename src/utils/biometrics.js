@"
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class BiometricService {

  // Vérifier si l'empreinte est disponible (simulation)
  async isAvailable() {
    // Sur un vrai appareil, on vérifierait avec le module natif
    // Pour le développement, on simule que c'est disponible
    return true;
  }

  // Demander l'authentification par empreinte (simulation)
  async authenticate() {
    return new Promise((resolve) => {
      Alert.alert(
        '🔐 Authentification biométrique',
        'Simulation: Posez votre doigt sur le capteur (Mode développement)',
        [
          {
            text: 'Annuler',
            onPress: () => resolve({ success: false, error: 'Annulé par l\'utilisateur' })
          },
          {
            text: 'Authentifier',
            onPress: () => {
              // Simuler une vérification après 1 seconde
              setTimeout(() => {
                resolve({ success: true, error: null });
              }, 1000);
            }
          }
        ],
        { cancelable: false }
      );
    });
  }

  // Enregistrer la préférence utilisateur
  async savePreference(enabled) {
    try {
      await AsyncStorage.setItem('fingerprint_enabled', JSON.stringify(enabled));
    } catch (error) {
      console.error('Erreur sauvegarde préférence:', error);
    }
  }

  // Récupérer la préférence utilisateur
  async getPreference() {
    try {
      const value = await AsyncStorage.getItem('fingerprint_enabled');
      return value ? JSON.parse(value) : false;
    } catch (error) {
      console.error('Erreur récupération préférence:', error);
      return false;
    }
  }
}

export default new BiometricService();
"@ | Out-File -FilePath src/utils/biometrics.js -Encoding UTF8