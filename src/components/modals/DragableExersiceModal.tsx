import React, {
  useCallback, useMemo, useRef, useState, useEffect,
} from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import {
  IconButton, List, Divider,
} from 'react-native-paper';
import BottomSheet, {
  BottomSheetView, BottomSheetFooter, BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import ModalActiveWorkoutList from '../ModalActiveWorkoutList';
import CurrentWorkoutContext, {
  useStartTimer, useCurrentWorkoutTime, usePauseTimer, useNextExercise,
} from '../../contexts/CurrentWorkoutDataContext';
import GainsDataContext, {
  useExercises,
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
  // const findExerciseIndex = useFindExerciseIndex();
  const showTimer = useCurrentWorkoutTime();
  const exercises = useExercises();
  const nextExercise = useNextExercise();
  const [togglePause, setTogglePause] = useState(true);
  const { activeWorkout, exercisesInActiveWorkout } = React.useContext(CurrentWorkoutContext);
  const {
    getCompletedSetCountForExercise, nonCompletedExercisesInActiveWorkout, currentExercise, selectExercise, finishWorkout,
  } = React.useContext(CurrentWorkoutContext);
  const { getTotalSetCountForExercise } = React.useContext(GainsDataContext);

  // variables
  const snapPoints = useMemo(() => [100, '100%'], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // handleSnapPress(1);
  }, []);

  useEffect(() => {
    if (currentExercise) {
      navigation.setParams({ exercise: currentExercise });
    } else if (currentExercise === null) {
      finishWorkout();
    }
  }, [currentExercise, navigation, finishWorkout]);

  const shouldShowCompletedExercise = useCallback((exerciseId: string) => {
    const completedSetCount = getCompletedSetCountForExercise(exerciseId);
    const totalSetCount = getTotalSetCountForExercise(exerciseId);
    return completedSetCount >= totalSetCount;
  }, [getCompletedSetCountForExercise, getTotalSetCountForExercise]);

  const shouldShowUncompletedExercise = useCallback((exerciseId: string) => {
    const completedSetCount = getCompletedSetCountForExercise(exerciseId);
    const totalSetCount = getTotalSetCountForExercise(exerciseId);
    return completedSetCount < totalSetCount;
  }, [getCompletedSetCountForExercise, getTotalSetCountForExercise]);

  const pauseAndResume = useCallback(() => {
    if (togglePause === true) {
      pauseTimer();
      setTogglePause(false);
    } else {
      startTimer();
      setTogglePause(true);
    }
  }, [startTimer, pauseTimer, togglePause]);
  useEffect(() => {
    if (currentExercise === null) {
      pauseTimer();
      setTogglePause(false);
    }
  }, [togglePause, startTimer, pauseTimer, currentExercise]);

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
            <Text style={{ fontSize: 16 }}>
              {/* { exercisesInActiveWorkout[selected]?.name} */}
            </Text>
            <IconButton
              style={styles.iconBtn}
              animated
              size={ICONSIZE}
              icon='arrow-right'
              onPress={nextExercise}
            />
          </View>
        </View>
      </BottomSheetFooter>
    ),
    [togglePause, pauseAndResume, nextExercise],
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
            <Text style={{
              fontSize: 25, alignItems: 'center', justifyContent: 'center', padding: 10,
            }}
            >
              {showTimer}
            </Text>
          </View>
          <Text>Active Workout</Text>
          <ModalActiveWorkoutList isExerciseCompleted={shouldShowUncompletedExercise} textColor='grey' />
          {currentExercise === null ? (<Text>Workout completed</Text>) : (<Text>Completed Exercises</Text>)}
          <ModalActiveWorkoutList isExerciseCompleted={shouldShowCompletedExercise} textColor='green' />
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
  colapsedNavContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  iconBtn: {},
  contentContainer: {
    flex: 1,
  },
});

export default ExerciseModal;

// if (exerciseinWorkoutSetsThatYouaddtoit !== setsDoneForExercisethatisAddtoYourWorkout) {
// show exercise in list
// }
