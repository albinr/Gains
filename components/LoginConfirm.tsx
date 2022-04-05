import React, { useCallback, useContext, useState } from 'react';
import { View, TextInput, Text, Button } from 'react-native';

import { useLoginConfirmMutation } from '../clients/healthcloud.generated';
import { AuthContext } from '../contexts/AuthContext';

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
    <View>
      <Text>Get them GAINS</Text>
      <TextInput
        placeholder='Login Code'
        value={code}
        keyboardType='numbers-and-punctuation'
        onChangeText={setCode}
        onSubmitEditing={onSubmit}
        enablesReturnKeyAutomatically
        returnKeyType='send'
      />
      <Button title='Continue' onPress={onSubmit} />
    </View>
  );
};

export default LoginConfirm;