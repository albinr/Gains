import React, { useCallback, useContext, useState } from 'react';
import { Button, TextInput } from 'react-native-paper';

import { Text, View } from './Themed';
import { useLoginConfirmMutation } from '../clients/healthcloud.generated';
import { AuthContext } from '../contexts/AuthContext';
import { styles } from '../../constants/Styles';

const LoginConfirm: React.FC<{readonly email:string}> = ({ email }) => {
  const [code, setCode] = useState('');
  const { login } = useContext(AuthContext);
  const [, loginConfirm] = useLoginConfirmMutation();
  const onSubmit = useCallback(async () => {
    const { data, error } = await loginConfirm({
      email,
      code,
    });
    if (data?.loginConfirm.__typename === 'LoginConfirmSuccessfulResponse') {
      login(data.loginConfirm.accessToken);
    }
    if (error) {
      console.log('error', error);
    }
  }, [code, email, loginConfirm, login]);

  return (
    <View style={styles.container}>
      <TextInput
        label='Confirmation Code'
        keyboardType='number-pad'
        value={code}
        onChangeText={setCode}
        onSubmitEditing={onSubmit}
        enablesReturnKeyAutomatically
        returnKeyType='send'
      />
      <Button mode='contained' onPress={onSubmit} style={styles.btn}>Confirm</Button>
    </View>
  );
};

export default LoginConfirm;
