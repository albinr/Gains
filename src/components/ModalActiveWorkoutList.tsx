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
import { RootStackParamList } from '../../types';
import { ExerciseDefaultFragment } from '../clients/healthcloud.generated';

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

  const renderActiveWorkoutItem = useCallback(({ item }: { readonly item: ExerciseDefaultFragment }) => {
    const setCount = getCompletedSetCountForExercise(item._id);
    const totalSetCount = getTotalSetCountForExercise(item._id);
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

    if (isExerciseCompleted(item._id)) {
      return (
        <View>
          <List.Item
            style={{ backgroundColor: 'white' }}
            title={item.name}
            onPress={() => {
              selectExercise(item._id);
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
