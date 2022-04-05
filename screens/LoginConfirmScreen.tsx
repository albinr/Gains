import { StyleSheet } from 'react-native';

import LoginConfirm from '../components/LoginConfirm';
import { View } from '../components/Themed';
import { LoginScreenProps } from '../types';

export default function LoginConfirmScreen({ route: { params: { email } } }: LoginScreenProps<'LoginConfirm'>) {
  return (
    <View>
      <LoginConfirm email={email} />
    </View>
  );
}