import React, {
  useCallback, useMemo, useRef, useState, useEffect,
} from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import {
  List, Divider,
} from 'react-native-paper';
import { BottomSheetFlatList, BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import CurrentWorkoutContext, {
  useStartTimer, useCurrentWorkoutTime, usePauseTimer, useNextExercise,
} from '../contexts/CurrentWorkoutDataContext';
import GainsDataContext, {
  useExercises,
} from '../contexts/GainsDataContext';
import { WorkoutExerciseType } from '../../clients/__generated__/schema';
import { Exercise, RootStackParamList } from '../../types';

const ModalActiveWorkoutList: React.FC <{ readonly isExerciseCompleted: (exerciseId: string) => boolean, readonly textColor: string }> = ({
  isExerciseCompleted, textColor,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const exercisesId = React.useContext(CurrentWorkoutContext).activeWorkout?.exercisesWithStatus?.find((exercise) => exercise.exerciseId);
  const {
    getCompletedSetCountForExercise, selectExercise, exercisesInActiveWorkout,
  } = React.useContext(CurrentWorkoutContext);
  const { getTotalSetCountForExercise } = React.useContext(GainsDataContext);

  // styles

  const renderActiveWorkoutItem = useCallback(({ item }: { readonly item: Exercise }) => {
    const setCount = getCompletedSetCountForExercise(item.id);
    const totalSetCount = getTotalSetCountForExercise(item.id);
    const right = ({ ...props }) => (
      <Text style={{
        color: textColor, paddingRight: 10,
      }}
      >
        {setCount}
        {' '}
        /
        {' '}
        {totalSetCount}
      </Text>
    );

    if (isExerciseCompleted(item.id)) {
      return (
        <View>
          <List.Item
            style={{ backgroundColor: 'white' }}
            title={item.name}
            // onPress={() => console.log('pressed', item)}
            onPress={() => {
              selectExercise(item.id);
              // navigation.setParams({ exercise: item });
            }}
            right={right}
          />
          <Divider />
        </View>
      );
    }
    return null;
  }, [getCompletedSetCountForExercise, getTotalSetCountForExercise, isExerciseCompleted, selectExercise, textColor]);

  return (
    <BottomSheetFlatList
      data={exercisesInActiveWorkout}
      renderItem={renderActiveWorkoutItem}
      contentContainerStyle={styles.contentContainer}
    />
  );
};
const styles = StyleSheet.create({
  contentContainer: {

    // backgroundColor: 'orange',
    // height: 100,
    // paddingHorizontal: 16,
    // overflow: 'visible',
  },
});

export default ModalActiveWorkoutList;
