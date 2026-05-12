@"
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import biometricService from '../utils/biometrics';

const SettingsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const darkMode = await AsyncStorage.getItem('darkMode');
      const fingerprint = await biometricService.getPreference();
      const notifications = await AsyncStorage.getItem('notifications');

      setIsDarkMode(darkMode === 'true');
      setIsFingerprintEnabled(fingerprint);
      setNotificationsEnabled(notifications !== 'false');
    } catch (error) {
      console.error('Erreur chargement settings:', error);
    }
  };

  const toggleDarkMode = async (value) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem('darkMode', value.toString());
  };

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notifications', value.toString());
  };

  const toggleFingerprint = async (value) => {
    setIsFingerprintEnabled(value);
    await biometricService.savePreference(value);

    if (value) {
      Alert.alert(
        '🔐 Empreinte digitale',
        'Activez l\'authentification par empreinte pour déverrouiller l\'application',
        [
          { text: 'Plus tard', style: 'cancel' },
          {
            text: 'Configurer',
            onPress: () => navigation.navigate('Fingerprint', { returnTo: 'Settings' })
          },
        ]
      );
    }
  };

  const handleAbout = () => {
    Alert.alert(
      'À propos',
      'Application de déverrouillage\nVersion 1.0.0\n\nDéveloppé par votre équipe',
      [{ text: 'OK' }]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Effacer les données',
      'Êtes-vous sûr de vouloir effacer toutes vos préférences ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            setIsDarkMode(false);
            setIsFingerprintEnabled(false);
            setNotificationsEnabled(true);
            Alert.alert('Succès', 'Toutes les données ont été effacées');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apparence</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>🌙 Mode sombre</Text>
            <Text style={styles.settingDescription}>Activer le thème sombre</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sécurité</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>🔐 Déverrouillage par empreinte</Text>
            <Text style={styles.settingDescription}>Utilisez votre empreinte pour déverrouiller l'app</Text>
          </View>
          <Switch
            value={isFingerprintEnabled}
            onValueChange={toggleFingerprint}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={isFingerprintEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>🔔 Activer les notifications</Text>
            <Text style={styles.settingDescription}>Recevoir des alertes importantes</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>ℹ️ À propos</Text>
            <Text style={styles.settingDescription}>Version et informations</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingText, styles.dangerText]}>🗑️ Effacer toutes les données</Text>
            <Text style={styles.settingDescription}>Réinitialiser toutes les préférences</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
  },
  dangerText: {
    color: '#ff3b30',
  },
  arrow: {
    fontSize: 24,
    color: '#ccc',
  },
});

export default SettingsScreen;
"@ | Out-File -FilePath src/screens/SettingsScreen.js -Encoding UTF8