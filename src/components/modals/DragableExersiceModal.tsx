import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import {
  View, Text, StyleSheet, Button, Pressable,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const ExerciseModal = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => [100, '80%'], []);
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
  // renders
  return (
    <View style={styles.container}>
      <Button title='Snap To 50%' onPress={() => handleSnapPress(1)} />
      <Button title='Snap To 25%' onPress={() => handleSnapPress(0)} />
      <Button title='Expand' onPress={handleExpandPress} />
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enableContentPanningGesture
        enableHandlePanningGesture
        enableOverDrag
        animateOnMount
        enablePanDownToClose
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={{ flexDirection: 'row' }}>
            <IconButton icon='arrow-up' onPress={() => handleSnapPress(1)} />
            <IconButton icon='arrow-down' onPress={() => handleSnapPress(0)} />
          </View>
        </BottomSheetView>
      </BottomSheet>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ExerciseModal;
