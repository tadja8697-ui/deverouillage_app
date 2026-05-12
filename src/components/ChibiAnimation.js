@"
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const ChibiAnimation = ({
  visible = true,
  size = 200,
  message = "Vérification en cours..."
}) => {
  if (!visible) return null;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.animationContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.emoji}>🔐</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    height: '100%',
  },
  message: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emoji: {
    fontSize: 50,
    marginTop: 20,
  },
});

export default ChibiAnimation;
"@ | Out-File -FilePath src/components/ChibiAnimation.js -Encoding UTF8