import React, {
  useCallback, useMemo, useRef, useState, useEffect,
} from 'react';
import {
  View, Text, StyleSheet, Button, Pressable,
} from 'react-native';
import {
  IconButton, List, TextInput, Divider,
} from 'react-native-paper';
import BottomSheet, {
  BottomSheetView, BottomSheetFooter, BottomSheetFlatList, BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import CurrentWorkoutContext, {
  useStartTimer, useStartWorkout, useAddExerciseToWorkout, useRemoveExercise, useCurrentWorkoutTime, usePauseTimer, useNextExercise,
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
  const completedExercisesId = React.useContext(CurrentWorkoutContext).activeWorkout?.exercisesWithStatus?.find((exercise) => exercise.exerciseId);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const startTimer = useStartTimer();
  const pauseTimer = usePauseTimer();
  const showTimer = useCurrentWorkoutTime();
  const exercises = useExercises();
  const nextExercise = useNextExercise();
  const [togglePause, setTogglePause] = useState(false);
  const { activeWorkout, exercisesInActiveWorkout } = React.useContext(CurrentWorkoutContext);
  const { getCompletedSetCountForExercise } = React.useContext(CurrentWorkoutContext);
  const { getTotalSetCountForExercise } = React.useContext(GainsDataContext);

  // variables
  const snapPoints = useMemo(() => [100, '100%'], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // handleSnapPress(1);
  }, []);
  const onNextExercise = useMemo(() => {
    if (!activeWorkout) {
      return '';
    }
    return activeWorkout?.exercisesWithStatus?.find((exercise) => exercise.exerciseId)?.exerciseId || '';
  }, [activeWorkout]);

  /*  const onPress = useCallback((exerciseId: string) => {
    // const exercise = exercisesInActiveWorkout.find((exercise) => exercise.id === exerciseId);
    if (activeWorkout) {
      void nextExercise(exerciseId);
    }
  }, [activeWorkout, nextExercise]);
 */
  const isExerciseCompleted = useCallback((exerciseId: string) => {
    const completedSetCount = getCompletedSetCountForExercise(exerciseId);
    const totalSetCount = getTotalSetCountForExercise(exerciseId);
    return completedSetCount >= totalSetCount;
  }, [getCompletedSetCountForExercise, getTotalSetCountForExercise]);

  const renderActiveWorkoutItem = useCallback(({ item }: { readonly item: Exercise }) => {
    const setCount = getCompletedSetCountForExercise(item.id);
    const totalSetCount = getTotalSetCountForExercise(item.id);
    const right = ({ ...props }) => (
      <Text style={{ color: 'gray', padding: 10 }}>
        {setCount}
        {' '}
        /
        {' '}
        {totalSetCount}
      </Text>
    );

    if (!isExerciseCompleted(item.id)) {
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
    }
    return null;
  }, [getCompletedSetCountForExercise, getTotalSetCountForExercise, navigation, isExerciseCompleted]);

  const renderCompletedActiveWorkoutItem = useCallback(({ item }: { readonly item: Exercise }) => {
    const setCount = getCompletedSetCountForExercise(item.id);
    const totalSetCount = getTotalSetCountForExercise(item.id);
    const right = ({ ...props }) => (
      <Text style={{ color: 'lightgreen', padding: 10 }}>
        {setCount}
        {' '}
        /
        {' '}
        {totalSetCount}
      </Text>
    );
    if (isExerciseCompleted(item.id)) {
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
    }
    return null;
  }, [getCompletedSetCountForExercise, getTotalSetCountForExercise, navigation, isExerciseCompleted]);
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
            <Text style={{ fontSize: 8 }}>
              Next:
              {' '}
            </Text>
            <IconButton
              style={styles.iconBtn}
              animated
              size={ICONSIZE}
              icon='arrow-right'
              onPress={() => { nextExercise(onNextExercise); }}
            />
          </View>
        </View>
      </BottomSheetFooter>
    ),
    [togglePause, pauseAndResume, nextExercise, onNextExercise],
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
              <Text style={{ fontSize: 30 }}>{showTimer}</Text>
            </View>
          </View>
          <Divider />
          <Text>Active Workout</Text>
          <Divider />
          <BottomSheetFlatList
            data={exercisesInActiveWorkout}
            renderItem={renderActiveWorkoutItem}
            contentContainerStyle={styles.flatListContent}
          />
          <Divider />
          <Text>Completed Exercises</Text>
          <Divider />
          <BottomSheetFlatList
            data={exercisesInActiveWorkout}
            renderItem={renderCompletedActiveWorkoutItem}
            contentContainerStyle={styles.flatListContent}
          />
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
  flatListContent: {},
});

export default ExerciseModal;

// if (exerciseinWorkoutSetsThatYouaddtoit !== setsDoneForExercisethatisAddtoYourWorkout) {
// show exercise in list
// }
