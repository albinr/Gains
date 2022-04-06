import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider } from 'react-native-paper';
import AuthProvider from './src/contexts/AuthContext';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WorkoutContextProvider } from './src/contexts/WorkoutDataContext';

import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './navigation';
import { SnackbarProvider } from 'react-native-telegraph';

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
          <WorkoutContextProvider>      
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
          </WorkoutContextProvider>
          </SnackbarProvider>
        </Provider>
    </AuthProvider>
    );
}
