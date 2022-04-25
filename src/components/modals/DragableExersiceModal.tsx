import React, {
  useCallback, useMemo, useRef, useState, useEffect,
} from 'react';
import {
  View, Text, StyleSheet, Button, Pressable,
} from 'react-native';
import {
  IconButton, List, TextInput, Divider,
} from 'react-native-paper';
import BottomSheet, { BottomSheetView, BottomSheetFooter, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import CurrentWorkoutContext, {
  useStartTimer, useStartWorkout, useAddExerciseToWorkout, useRemoveExercise, useCurrentWorkoutTime, usePauseTimer,
} from '../../contexts/CurrentWorkoutDataContext';
import GainsDataContext, {
  useExercises, useAddExercise, useWorkouts,
} from '../../contexts/GainsDataContext';
import { WorkoutExerciseType } from '../../clients/__generated__/schema';
import { Exercise, RootStackParamList } from '../../../types';

const ICONSIZE = 40;
const ExerciseModal = () => {
  // ref
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const exercisesId = React.useContext(CurrentWorkoutContext).activeWorkout?.exercisesWithStatus?.find((exercise) => exercise.exerciseId);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const startTimer = useStartTimer();
  const pauseTimer = usePauseTimer();
  const showTimer = useCurrentWorkoutTime();
  const exercises = useExercises();
  const [togglePause, setTogglePause] = useState(false);
  const { activeWorkout, exercisesInActiveWorkout } = React.useContext(CurrentWorkoutContext);
  const { getCompletedSetCountForExercise } = React.useContext(CurrentWorkoutContext);
  const { getTotalSetCountForExercise } = React.useContext(GainsDataContext);

  // variables
  const snapPoints = useMemo(() => [100, '99%'], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // handleSnapPress(1);
  }, []);

  const renderActiveWorkoutItem = useCallback(({ item }: { readonly item: Exercise }) => {
    const setCount = getCompletedSetCountForExercise(item.id);
    const totalSetCount = getTotalSetCountForExercise(item.id);
    const right = ({ ...props }) => (
      <Text style={{ color: 'gray' }}>
        {setCount}
        {' '}
        /
        {' '}
        {totalSetCount}
      </Text>
    );
    return (
      <List.Item
        style={{ backgroundColor: 'white' }}
        title={item.name}
        // onPress={() => console.log('pressed', item)}
        onPress={() => {
          navigation.navigate('Modal', { exercise: item });
        // navigation.setParams({ exercise: item });
        }}
        right={right}
      />
    );
  }, [getCompletedSetCountForExercise, getTotalSetCountForExercise, navigation]);
  const pauseAndResume = useCallback(() => {
    if (togglePause === true) {
      pauseTimer();
      setTogglePause(false);
    } else {
      startTimer();
      setTogglePause(true);
    }
  }, [startTimer, pauseTimer, togglePause]);

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props}>
        <View style={styles.colapsedNavContainer}>
          <View style={{ flex: 1 }}>
            <IconButton style={styles.iconBtn} animated size={ICONSIZE} icon='qrcode' onPress={() => console.log('Pressed')} />
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <IconButton style={styles.iconBtn} animated size={ICONSIZE} icon={togglePause === true ? ('pause') : ('play')} onPress={() => { pauseAndResume(); }} />
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
    [pauseAndResume, togglePause],
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
              <Text>{showTimer}</Text>
            </View>
          </View>
          <Divider />
          <Text>Active Workout</Text>
          <Divider />
          <View style={{ height: '30%' }}>
            <BottomSheetFlatList
              data={exercisesInActiveWorkout}
              renderItem={renderActiveWorkoutItem}
            />
          </View>
          <Divider />
          <Text>Completed Exercises</Text>
          <Divider />
          <View>
            <BottomSheetFlatList
              data={exercisesInActiveWorkout}
              renderItem={renderActiveWorkoutItem}
            />
          </View>
          <Divider />
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

// if (exerciseinWorkoutSetsThatYouaddtoit !== setsDoneForExercisethatisAddtoYourWorkout) {
// show exercise in list
// }
