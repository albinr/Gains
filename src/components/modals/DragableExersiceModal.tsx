import React, {
  useCallback, useMemo, useRef, useState, useEffect,
} from 'react';
import {
  StyleSheet,
} from 'react-native';
import {
  IconButton, Button, Divider,
} from 'react-native-paper';
import BottomSheet, {
  BottomSheetView, BottomSheetFooter,
} from '@gorhom/bottom-sheet';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import Handle from './CustomHandle';
import { View, Text, CustomBackground } from '../Themed';
import ModalActiveWorkoutList from '../ModalActiveWorkoutList';
import SaveWorkout from '../SaveWorkout';
import CurrentWorkoutContext, {
  useStartTimer, useCurrentWorkoutTime, usePauseTimer, useNextExercise,
} from '../../contexts/CurrentWorkoutDataContext';
import GainsDataContext, {
  useExercises, useUpsertWorkoutTemplate,
} from '../../contexts/GainsDataContext';
import { WorkoutExerciseType } from '../../clients/__generated__/schema';
import { RootStackParamList, Workout, WorkoutTemplate } from '../../../types';
import useBoolState from '../../hooks/useBoolState';

const ICONSIZE = 40;
const ExerciseModal = () => {
  // ref
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const exercisesId = React.useContext(CurrentWorkoutContext).activeWorkout?.exercisesWithStatus?.find((exercise) => exercise.exerciseId);
  // const completedExercisesId = React.useContext(CurrentWorkoutContext).activeWorkout?.exercisesWithStatus?.find((exercise) => exercise.exerciseId);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const startTimer = useStartTimer();
  const pauseTimer = usePauseTimer();
  const upsertWorkoutTemplate = useUpsertWorkoutTemplate();
  const [isCreateWorkoutDialogVisible, showWorkoutDialog, hideWorkoutDialog] = useBoolState(false);
  // const findExerciseIndex = useFindExerciseIndex();
  const showTimer = useCurrentWorkoutTime();
  const exercises = useExercises();
  const nextExercise = useNextExercise();
  const [togglePause, setTogglePause] = useState(true);
  const { activeWorkout, exercisesInActiveWorkout } = React.useContext(CurrentWorkoutContext);
  const {
    getCompletedSetCountForExercise, nonCompletedExercisesInActiveWorkout, currentExercise, selectExercise, finishWorkout, isExerciseCompleted,
  } = React.useContext(CurrentWorkoutContext);
  const { getTotalSetCountForExercise, workoutTemplates } = React.useContext(GainsDataContext);

  // variables
  const snapPoints = useMemo(() => [92, '100%'], []);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // handleSnapPress(1);
  }, []);
  const addWorkoutToTemplate = useCallback((workout : Workout, favourite: boolean, name: string) => {
    const exerciseIds = workout.exercisesWithStatus.map((exercise) => exercise.exerciseId);

    const workoutTemplate = {
      exercisesId: exerciseIds,
      name: name === '' ? (`Workout Template`) : name,
      favourite: !!favourite,
      createdAt: new Date(),
      id: workout.id,
    };
    upsertWorkoutTemplate(workoutTemplate.exercisesId, workoutTemplate.name, workoutTemplate.favourite, workoutTemplate.createdAt, workoutTemplate.id);
  }, [upsertWorkoutTemplate]);

  useEffect(() => {
    if (!activeWorkout) {
      return;
    }
    // const workoutTemplate = prev.find((template) => template.id === workoutTemplateId)
    if (currentExercise) {
      navigation.setParams({ exercise: currentExercise });
    } else if (currentExercise === null) {
      if (workoutTemplates && !workoutTemplates.find((template) => template.id === activeWorkout.id)) {
        addWorkoutToTemplate(activeWorkout, false, '');
      }
      // Congrats Dialog ShowCongratsMessage;
      finishWorkout();
    }
  }, [currentExercise, navigation, finishWorkout, activeWorkout, addWorkoutToTemplate, workoutTemplates]);

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
        <View darkColor='#8559da' lightColor='#b987ff' style={[styles.NavContainer]}>
          {/* <View style={{ flex: 1 }}> */}
          <IconButton style={styles.iconBtn} animated size={ICONSIZE} icon='qrcode' onPress={() => {}} />
          {/* </View> */}
          {/* <View style={{ alignItems: 'center', justifyContent: 'center' }}> */}
          <IconButton style={styles.iconBtn} animated size={ICONSIZE} icon={togglePause === true ? ('pause') : ('play')} onPress={() => { pauseAndResume(); }} />
          {/* </View> */}
          {/* <View style={{
            flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'flex-end',
          }}
          > */}
          {/* <Text style={{ fontSize: 16 }}>
              { exercisesInActiveWorkout[selected]?.name}
            </Text> */}

          <IconButton
            style={styles.iconBtn}
            animated
            size={ICONSIZE}
            icon={currentExercise && nonCompletedExercisesInActiveWorkout.length <= 1 && isExerciseCompleted(currentExercise._id) ? ('check') : ('chevron-right')}
            onPress={nextExercise}
          />
          {/* </View> */}
        </View>
      </BottomSheetFooter>
    ),

    [togglePause, currentExercise, nextExercise, pauseAndResume, isExerciseCompleted, nonCompletedExercisesInActiveWorkout],
  );

  // renders
  return (
    // <View style={styles.container}>
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      footerComponent={renderFooter}
      backgroundComponent={CustomBackground}
      handleComponent={Handle}
      index={0}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View darkColor='#000000' style={{ width: '100%', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 25, alignItems: 'center', justifyContent: 'center', padding: 10,
            }}
          >
            {showTimer}
          </Text>
        </View>
        <Button icon='plus' onPress={showWorkoutDialog}>Save workout</Button>
        <SaveWorkout
          isVisible={isCreateWorkoutDialogVisible}
          onDismiss={hideWorkoutDialog}
          title='Give it a name'
          onCreate={(name, favourite) => {
            hideWorkoutDialog();
            // const associatedCodes = lastScannedQRCode ? { [lastScannedQRCode.type]: lastScannedQRCode.data } : {};
            addWorkoutToTemplate(activeWorkout!, favourite, name);
          }}
        />
        <View darkColor='#522da8' lightColor='#8559da' style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.text}>Active Workout</Text>
        </View>
        <Divider style={{ height: 1 }} />
        <View style={{ flex: 1 }}>
          <View style={{ maxHeight: '50%' }}>
            <ModalActiveWorkoutList isExerciseCompleted={shouldShowUncompletedExercise} textColor='grey' />
          </View>
          <View darkColor='#522da8' lightColor='#8559da' style={{ justifyContent: 'center', alignItems: 'center' }}>
            {currentExercise === null ? (<Text style={styles.text}>Workout completed</Text>) : (<Text style={styles.text}>Completed Exercises</Text>)}
          </View>
          <View style={{ maxHeight: '50%' }}>
            <Divider style={{ height: 1 }} />
            <ModalActiveWorkoutList isExerciseCompleted={shouldShowCompletedExercise} textColor='green' />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
    // </View>
  );
};
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   height: '100%',
  //   width: '100%',
  //   padding: 24,
  //   position: 'absolute',
  //   bottom: 0,
  // },
  NavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    // backgroundColor: 'red',
  },
  iconBtn: {},
  text: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 16,

  },
  contentContainer: {
    flex: 1,
    borderColor: 'red',
    marginBottom: 72,
  },
});

export default ExerciseModal;
