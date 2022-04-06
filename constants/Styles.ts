import { StyleSheet } from 'react-native';

import Colors, { primary, secondary } from './Colors';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 300,
  },
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    color: primary,
    borderColor: '#9600A3',
  },
  btn: {
    margin: 10,
  },
  txt: {
    margin: 10,
  },
});

export {
  styles,
};
