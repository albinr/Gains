import React, { useMemo } from 'react';
import {
  StyleProp, StyleSheet, ViewStyle, Text,
} from 'react-native';
import { BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import { Divider } from 'react-native-paper';

import { View, useThemeColor } from '../Themed';

interface HandleProps extends BottomSheetHandleProps {
  readonly style?: StyleProp<ViewStyle>;
}

const Handle: React.FC<HandleProps> = ({ style, animatedIndex }) => (
  <View style={styles.header}>
    <View style={[styles.handle, { backgroundColor: useThemeColor({ light: '#000', dark: '#fff' }, 'background') }]} />
  </View>
);

export default Handle;

const styles = StyleSheet.create(
  {
    header: {
      height: 20,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    handle: {
      width: '10%',
      height: 5,
      backgroundColor: 'black',
      borderRadius: 10,
    },
  },
);
