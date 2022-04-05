import { StyleSheet } from 'react-native';

import LoginRequest from '../components/LoginRequest';
import { View } from '../components/Themed';
import { LoginScreenProps } from '../types';

export default function LoginRequestScreen({ navigation }: LoginScreenProps<'LoginRequest'>) {
  return (
    <View>
      <LoginRequest
        onEmailRequested={(email) => navigation.navigate('LoginConfirm', { email })}
      />
    </View>
  );
}