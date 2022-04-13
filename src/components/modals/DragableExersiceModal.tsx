import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import {
  View, Text, StyleSheet, Button, Pressable,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import BottomSheet, { BottomSheetView, BottomSheetFooter } from '@gorhom/bottom-sheet';

const ICONSIZE = 30;

const ExerciseModal = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  // variables
  const snapPoints = useMemo(() => [100, '100%'], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    // handleSnapPress(1);
  }, []);
  const handleSnapPress = useCallback((index) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);
  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={24}>
        <View style={styles.colapsedNavContainer}>
          <IconButton animated size={ICONSIZE} icon='pause' onPress={() => console.log('Pressed')} />
          <IconButton animated size={ICONSIZE} icon='qrcode' onPress={() => console.log('Pressed')} />
          <IconButton animated size={ICONSIZE} icon='arrow-right' onPress={() => console.log('Pressed')} />
        </View>
      </BottomSheetFooter>
    ),
    [],
  );

  // renders
  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        footerComponent={renderFooter}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View>
            <Text>Hello</Text>
          </View>
        </BottomSheetView>
      </BottomSheet>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    padding: 24,
    position: 'absolute',
    bottom: 0,
  },
  footerContainer: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#80f',
  },
  colapsedNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ExerciseModal;
