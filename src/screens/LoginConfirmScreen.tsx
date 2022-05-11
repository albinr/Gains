import { View } from '../components/Themed';
import { styles } from '../../constants/Styles';
import LoginConfirm from '../components/LoginConfirm';
import { LoginScreenProps } from '../../types';

export default function LoginConfirmScreen({ route: { params: { email } } }: LoginScreenProps<'LoginConfirm'>) {
  return (
    <View style={styles.wrapper}>
      <LoginConfirm email={email} />
    </View>
  );
}
