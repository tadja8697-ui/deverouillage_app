import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LockScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Écran de verrouillage</Text>
      <Text style={styles.subtitle}>
        (Partie 2 - Options de déverrouillage à venir)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
});

export default LockScreen;