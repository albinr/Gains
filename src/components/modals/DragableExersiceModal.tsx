import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import {
  View, Text, StyleSheet, Button, Pressable,
} from 'react-native';
import { IconButton, List, TextInput } from 'react-native-paper';
import BottomSheet, { BottomSheetView, BottomSheetFooter } from '@gorhom/bottom-sheet';
import { FlatList } from 'react-native-gesture-handler';

import CurrentWorkoutContext, {
  useStartTimer, useStartWorkout, useAddExerciseToWorkout, useRemoveExercise,
} from '../../contexts/CurrentWorkoutDataContext';
import {
  useExercises, useAddExercise, useWorkouts,
} from '../../contexts/GainsDataContext';
import { WorkoutExerciseType } from '../../clients/__generated__/schema';

const ICONSIZE = 35;
const ExerciseModal = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const timer = useStartTimer();
  const exercises = useExercises();
  const { activeWorkout } = React.useContext(CurrentWorkoutContext);
  // variables
  const snapPoints = useMemo(() => [90, '99%'], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    // handleSnapPress(1);
  }, []);

  const exercisesInActiveWorkout = useMemo(() => (activeWorkout?.exerciseIds || []).map((id) => exercises.find((e) => e.id === id)), [exercises, activeWorkout]);

  const renderActiveWorkoutItem = useCallback(({ item }) => (
    <List.Item
      style={{ backgroundColor: 'white' }}
      title={item.name}
      onPress={() => console.log('pressed', item)}
    />
  ), []);
  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props}>
        <View style={styles.colapsedNavContainer}>
          <View style={{ flex: 1 }}>
            <IconButton style={styles.iconBtn} animated size={ICONSIZE} icon='qrcode' onPress={() => console.log('Pressed')} />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <IconButton style={styles.iconBtn} animated size={ICONSIZE} icon='pause' onPress={timer} />
          </View>
          <View style={{
            flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'flex-end',
          }}
          >
            <Text style={{ fontSize: 8 }}>Next:</Text>
            <IconButton style={styles.iconBtn} animated size={ICONSIZE} icon='arrow-right' onPress={() => console.log('Pressed')} />
          </View>
        </View>
      </BottomSheetFooter>
    ),
    [timer],
  );

  // renders
  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        footerComponent={renderFooter}
        index={0}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <View>
              <Text>00:00</Text>
            </View>
          </View>
          <TextInput placeholder='Search for exercises...' dense />
          <FlatList
            data={exercisesInActiveWorkout}
            renderItem={renderActiveWorkoutItem}
          />
        </BottomSheetView>
      </BottomSheet>

    </View>
  );
};

// { timer ? <Text>{ timer }</Text> : null }
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    padding: 24,
    position: 'absolute',
    bottom: 0,
  },
  colapsedNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  iconBtn: {
    borderColor: 'black',
    borderWidth: 2,
  },
  contentContainer: {
    flex: 1,
  },
});

export default ExerciseModal;
