import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
  preferences: {
    defaultUnlockMethod?: 'shake' | 'fingerprint' | 'faceid';
  };
}

const STORAGE_KEYS = {
  USER_DATA: '@unlock_app:user_data',
  IS_FIRST_LAUNCH: '@unlock_app:is_first_launch',
};

export const storage = {
  // Vérifier si c'est le premier lancement
  async isFirstLaunch(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_FIRST_LAUNCH);
      if (value === null) {
        // Premier lancement, on marque comme vu
        await AsyncStorage.setItem(STORAGE_KEYS.IS_FIRST_LAUNCH, 'false');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking first launch:', error);
      return true;
    }
  },

  // Sauvegarder les données utilisateur
  async saveUserData(userData: UserData): Promise<void> {
    try {
      const jsonValue = JSON.stringify(userData);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, jsonValue);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  // Récupérer les données utilisateur
  async getUserData(): Promise<UserData | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Mettre à jour partiellement les données
  async updateUserData(updates: Partial<UserData>): Promise<void> {
    try {
      const current = await this.getUserData();
      if (current) {
        const updated = { ...current, ...updates };
        await this.saveUserData(updated);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  },

  // Supprimer toutes les données (déconnexion ou reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      await AsyncStorage.removeItem(STORAGE_KEYS.IS_FIRST_LAUNCH);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  },
};