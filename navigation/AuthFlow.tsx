/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import * as React from 'react';
 
 import LoginConfirmScreen from '../screens/LoginConfirmScreen';
 import LoginScreen from '../screens/LoginRequestScreen';
 import ModalScreen from '../screens/ModalScreen';
 import NotFoundScreen from '../screens/NotFoundScreen';
 import {
   LoginParamList, LoginScreenProps, RootStackParamList,
 } from '../types';
 
 /**
   * A root stack navigator is often used for displaying modals on top of all other content.
   * https://reactnavigation.org/docs/modal
   */
/*  const Stack = createNativeStackNavigator<RootStackParamList>();
 
export default function NotLoggedInNavigator() {
   return (
     <Stack.Navigator>
       <Stack.Screen name='Root' component={StackNavNavigator} options={{ headerShown: false }} />
       <Stack.Screen name='NotFound' component={NotFoundScreen} options={{ title: 'Oops!' }} />
       <Stack.Group screenOptions={{ presentation: 'modal' }}>
         <Stack.Screen name='Modal' component={ModalScreen} />
       </Stack.Group>
     </Stack.Navigator>
   );
 }
  */
 /**
   * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
   * https://reactnavigation.org/docs/bottom-tab-navigator
   */
 const StackNav = createNativeStackNavigator<LoginParamList>();
 
 function StackNavNavigator() {
   return (
     <StackNav.Navigator
       initialRouteName='LoginRequest'
     >
       <StackNav.Screen
         name='LoginRequest'
         component={LoginScreen}
         options={({ navigation }: LoginScreenProps<'LoginRequest'>) => ({
           title: 'Login',
           headerShown: false,
         })}
       />
       <StackNav.Screen
         name='LoginConfirm'
         component={LoginConfirmScreen}
         options={{
           title: 'Login',
         }}
       />
     </StackNav.Navigator>
   );
 }