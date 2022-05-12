import React, { useCallback, useState } from 'react';
import { Button, TextInput } from 'react-native-paper';

import { Text, View } from './Themed';
import Colors, { tintColorLight } from '../../constants/Colors';
import { styles } from '../../constants/Styles';
import { useLoginRequestMutation } from '../clients/healthcloud.generated';

const LoginRequest: React.FC<{readonly onEmailRequested: (email: string) => void}> = ({ onEmailRequested }) => {
  const [email, setEmail] = useState('');
  const [, loginRequest] = useLoginRequestMutation();
  const onSubmit = useCallback(async () => {
    await loginRequest({
      email,
    });
    onEmailRequested(email);
  }, [email, loginRequest, onEmailRequested]);

  return (
    <View style={styles.container}>
      <TextInput
        label='Email'
        placeholderTextColor={tintColorLight}
        textAlign='center'
        value={email}
        keyboardType='email-address'
        onChangeText={setEmail}
        onSubmitEditing={onSubmit}
        enablesReturnKeyAutomatically
        autoCapitalize='none'
        returnKeyType='send'
      />
      <Button mode='contained' onPress={onSubmit} style={styles.btn}>CONTINUE</Button>
    </View>
  );
};

export default LoginRequest;
