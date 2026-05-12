import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Vérifier le premier lancement
  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.log('Erreur checkFirstLaunch:', error);
      setIsFirstLaunch(true);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return;
    }

    setIsSaving(true);
    try {
      const userData = {
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('hasLaunched', 'true');
      
      Alert.alert('Succès', 'Bienvenue !', [
        { text: 'OK', onPress: () => setIsFirstLaunch(false) }
      ]);
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'enregistrer");
      console.log('Erreur saveUser:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Écran de chargement
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Écran de verrouillage (si déjà enregistré)
  if (!isFirstLaunch) {
    return (
      <View style={styles.lockContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🔓</Text>
        </View>
        <Text style={styles.lockTitle}>Écran verrouillé</Text>
        <Text style={styles.lockSubtitle}>
          Les 3 options arrivent bientôt !
        </Text>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={async () => {
            await AsyncStorage.clear();
          }}
        >
          <Text style={styles.resetButtonText}>Reset (test)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Écran d'inscription (premier lancement)
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🔓</Text>
          </View>
          <Text style={styles.appName}>Déverrouillage Magique</Text>
        </View>

        <Text style={styles.title}>Bienvenue !</Text>
        <Text style={styles.subtitle}>
          Configurez votre application de déverrouillage
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
            style={[styles.button, isSaving && styles.buttonDisabled]}
            onPress={saveUser}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Commencer l'aventure</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>
          🔒 Vos informations sont stockées localement
        </Text>
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6C63FF',
  },
  lockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    padding: 20,
  },
  lockTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
  },
  lockSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2C3E50',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 40,
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
    padding: 15,
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

export default App;