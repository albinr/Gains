import React, { useCallback, useContext, useState } from 'react';
import { View, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';

import { useLoginConfirmMutation } from '../clients/healthcloud.generated';
import { AuthContext } from '../contexts/AuthContext';
import { styles } from '../../constants/Styles';

const LoginConfirm: React.FC<{readonly email:string}> = ({ email }) => {
  const [code, setCode] = useState('');
  const { login } = useContext(AuthContext);
  const [, loginConfirm] = useLoginConfirmMutation();
  const onSubmit = useCallback(async () => {
    console.log('confirming with', { code, email });
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
      <Text style={styles.txt}>Enter the code you recieved</Text>
      <TextInput
        placeholder='Login Code'
        keyboardType='number-pad'
        placeholderTextColor='#2f95dc'
        value={code}
        onChangeText={setCode}
        onSubmitEditing={onSubmit}
        enablesReturnKeyAutomatically
        returnKeyType='send'
        style={styles.input}
      />
      <Button mode='contained' onPress={onSubmit} style={styles.btn}>Continue</Button>
    </View>
  );
};

export default LoginConfirm;
