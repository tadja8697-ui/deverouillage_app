import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface LogoProps {
  size?: number;
  style?: ViewStyle;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 80, style, showText = true }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { width: size, height: size, borderRadius: size / 2 }]}>
        <Icon name="lock-open" size={size * 0.6} color="#FFFFFF" />
        <View style={styles.shakeBadge}>
          <Icon name="shake" size={size * 0.2} color="#FFD700" />
        </View>
      </View>
      {showText && (
        <Text style={styles.title}>Déverrouillage{'\n'}Magique</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  shakeBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    padding: 4,
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2C3E50',
  },
});

export default Logo;