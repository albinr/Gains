import { View } from 'react-native';
import LoginRequest from '../components/LoginRequest';
import { styles  } from '../../constants/Styles';
import { LoginScreenProps } from '../../types';

export default function LoginRequestScreen({ navigation }: LoginScreenProps<'LoginRequest'>) {
  return (
    <View style={styles.wrapper}>
      <LoginRequest
        onEmailRequested={(email) => navigation.navigate('LoginConfirm', { email })}
      />
    </View>
  );
}