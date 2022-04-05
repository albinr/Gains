import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

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
    <View >
      <Text>Get them gains NOW!!</Text>
      <TextInput
        placeholder='Email'
        value={email}
        keyboardType='email-address'
        onChangeText={setEmail}
        onSubmitEditing={onSubmit}
        enablesReturnKeyAutomatically
        autoCapitalize='none'
        returnKeyType='send'
      />
      <Button title='Continue' onPress={onSubmit} />
      <Text >New user? Just enter your email and we’ll send you the magic link - that’s all you need to get started!</Text>
    </View>
  );
};

export default LoginRequest;