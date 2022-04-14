import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SnackbarProvider } from 'react-native-telegraph';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthProvider from './src/contexts/AuthContext';
import { GainsContextProvider } from './src/contexts/GainsDataContext';
import { CurrentWorkoutContextProvider } from './src/contexts/CurrentWorkoutDataContext';
import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  }
  return (

    <AuthProvider>
      <Provider>
        <SnackbarProvider>
          <GainsContextProvider>
            <CurrentWorkoutContextProvider>
              <SafeAreaProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <Navigation colorScheme={colorScheme} />
                </GestureHandlerRootView>
                <StatusBar />
              </SafeAreaProvider>
            </CurrentWorkoutContextProvider>
          </GainsContextProvider>
        </SnackbarProvider>
      </Provider>
    </AuthProvider>

  );
}
