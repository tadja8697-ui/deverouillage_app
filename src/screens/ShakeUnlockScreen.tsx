import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
 StyleSheet,
  Image,
  Alert,
} from 'react-native';

import RNShake from 'react-native-shake';

const ShakeUnlockScreen = () => {

  const [shakeCount, setShakeCount] =
    useState<number>(0);

  const currentDay = new Date().getDay();

  const correctedDay =
    currentDay === 0 ? 7 : currentDay;

  const requiredShakes =
    (correctedDay * correctedDay) % 5;

  useEffect(() => {

    if (requiredShakes === 0) {
   Alert.alert(
        'Déverrouillé',
        'Aucune secousse nécessaire aujourd’hui'
      );

    }

  }, []);

  useEffect(() => {

    const subscription =
      RNShake.addListener(() => {

        setShakeCount((prev) => {

          const newCount = prev + 1;

          if (
            newCount >= requiredShakes &&
            requiredShakes !== 0
          ) {

            Alert.alert(
              'Déverrouillé',
              'Téléphone déverrouillé'
            );

          }
  return newCount;

        });

      });

    return () => {
      subscription.remove();
    };

  }, []);

  return (

    <View style={styles.container}>

      <Image
        source={{
          uri: 'https://picsum.photos/400',
        }}
        style={styles.image}
      />

      <Text style={styles.title}>
        Déverrouillage par secousse
      </Text>

      <Text style={styles.text}>
        Nombre de secousses :
      </Text>
  <Text style={styles.number}>
        {requiredShakes}
      </Text>

      <Text style={styles.counter}>
        Secousses détectées :
        {' '}
        {shakeCount}
      </Text>

    </View>

  );

};

export default ShakeUnlockScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
 image: {
    width: 250,
    height: 250,
    borderRadius: 20,
    marginBottom: 30,
  },

  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  text: {
    color: 'white',
    fontSize: 18,
  },

  number: {
    color: '#00E5FF',
    fontSize: 60,
    fontWeight: 'bold',
    marginVertical: 20,
  },

  counter: {
    color: 'white',
    fontSize: 22,
  },

});