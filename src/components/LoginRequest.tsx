import React, { useCallback, useState } from 'react';
// import { View, Text, TextInput, Button } from 'react-native';
import { View, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';

import Colors, { primary, secondary, tintColorLight } from '../../constants/Colors';
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
      <Text style={styles.txt}>Enter your email below to get started!</Text>
      <TextInput
        placeholder='Email'
        placeholderTextColor={tintColorLight}
        value={email}
        keyboardType='email-address'
        onChangeText={setEmail}
        onSubmitEditing={onSubmit}
        enablesReturnKeyAutomatically
        autoCapitalize='none'
        returnKeyType='send'
        style={styles.input}
      />
      <Button mode='contained' onPress={onSubmit} style={styles.btn}>CONTINUE</Button>
      <Text style={styles.txt}>New user? Just enter your email and we’ll send you the magic link - that’s all you need to get started!</Text>
    </View>
  );
};

export default LoginRequest;
