import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import LockScreen from '../screens/LockScreen';
import { storage } from '../storage/storage';
import { View, ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    const firstLaunch = await storage.isFirstLaunch();
    setIsFirstLaunch(firstLaunch);
  };

  if (isFirstLaunch === null) {
    // Écran de chargement
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <OnboardingScreen
                {...props}
                onComplete={() => setIsFirstLaunch(false)}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="LockScreen" component={LockScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;