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
  const snapPoints = useMemo(() => [100, '95%'], []);
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
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enableContentPanningGesture
        enableHandlePanningGesture
        enableOverDrag
        animateOnMount
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>hello</Text>
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ExerciseModal;
