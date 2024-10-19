import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AsyncStorageValue = string | number | object;

/**
 * ### usage:
 * ``` tsx
 * const { storedValue, setValueAsync, removeValueAsync, isLoading } = useAsyncStorage<number>('count', 0);
 * ```
 */
const useAsyncStorage = <T extends AsyncStorageValue>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve stored value from AsyncStorage when the component mounts
  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          setStoredValue(parseValue<T>(value));
        }
      } catch (error) {
        console.error('Failed to load value from AsyncStorage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  // Parse the value from AsyncStorage based on type
  const parseValue = <U extends AsyncStorageValue>(value: string): U => {
    try {
      return JSON.parse(value);
    } catch {
      return value as U; // If JSON parsing fails, return as string
    }
  };

  // Function to store value in AsyncStorage
  const setValueAsync = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Failed to save value to AsyncStorage', error);
    }
  };

  // Function to remove value from AsyncStorage
  const removeValueAsync = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Failed to remove value from AsyncStorage', error);
    }
  };

  return {
    storedValue, setValueAsync, removeValueAsync, isLoading
  } as const;
};

export default useAsyncStorage;