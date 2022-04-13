import React, {
  useContext, useEffect, useMemo, useState, useRef, useCallback,
} from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import {
  Button, Dialog, List, Portal,
  Searchbar, Text, TextInput, Title, useTheme, IconButton,
} from 'react-native-paper';

import ExerciseModal from '../components/modals/DragableExersiceModal';
import useBoolState from '../hooks/useBoolState';
import { RootTabScreenProps } from '../../types';
import { AuthContext } from '../contexts/AuthContext';
import {
  useExercises, useAddExercise, useWorkouts,
} from '../contexts/GainsDataContext';
import CurrentWorkoutContext, { useStartTimer, useStartWorkout, useAddExerciseToWorkout } from '../contexts/CurrentWorkoutDataContext';
import { WorkoutExerciseType } from '../../clients/__generated__/schema';

// const AddOriginalExercise React.FC<{ }> = ({,
// }) => {};

const CreateExercises: React.FC<{ readonly searchQuery: string, readonly onCreate: (name: string) => void }> = ({
  searchQuery, onCreate,
}) => {
  const workoutName = useRef('');

  const onCreateExercises = useCallback(() => {
    onCreate(searchQuery);
  }, [onCreate, searchQuery]);

  const right = ({ ...props }) => (
    <IconButton
      {...props}
      icon='plus'
      onPress={onCreateExercises}
    />
  );

  return (
    <List.Item
      title={searchQuery}
      description='Add Custom Exercise'
      right={right}
    />
  );
};

const normalizeString = (str: string) => {
  const normalized = str.toLocaleLowerCase().trim();
  // console.log('normalized', normalized);
  return normalized;
};
// ,  route: { params: { exercise }
export default function WorkoutListScreen({ navigation }: RootTabScreenProps<'WorkoutListTab'>) {
  const exercises = useExercises();
  const addExerciseToWorkout = useAddExerciseToWorkout();
  const addExercise = useAddExercise();
  const workout = useWorkouts();
  const startWorkout = useStartWorkout();
  const timer = useStartTimer();
  const { activeWorkout } = React.useContext(CurrentWorkoutContext);
  const { logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogVisible, setDialogVisible] = useBoolState(false);
  const workoutsToShow = useMemo(() => (searchQuery.length > 0
    ? exercises.filter((w) => w.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))
    : exercises), [searchQuery, exercises]);

  const shouldShowAdd = useMemo(() => searchQuery.length > 0
    && !workoutsToShow.find((w) => normalizeString(searchQuery) === normalizeString(w.name)), [searchQuery, workoutsToShow]);

  const exercisesInActiveWorkout = useMemo(() => (activeWorkout?.exerciseIds || []).map((id) => exercises.find((e) => e.id === id)), [exercises, activeWorkout]);

  useEffect(() => {
    startWorkout();
  }, [startWorkout]);

  console.log('Workout: ', [workout], 'activeWorkout: ', activeWorkout?.exerciseIds);

  /*  const onBlurSearch = useCallback(() => setDialogVisible, [setDialogVisible]);

  useEffect(() => {
    if (isDialogVisible === true && searchQuery.length > 0) {
      setSearchQuery('');
      setDialogVisible();
    }
  }, [isDialogVisible, setSearchQuery, setDialogVisible]); */

  useEffect(() => {
    navigation.setOptions({
    });
  }, [navigation]);
  const right = ({ ...props }) => (
    <IconButton
      {...props}
      icon='plus'
    />
  );
  const renderItem = useCallback(({ item }) => (
    <List.Item
      onPress={() => {
        // const associatedCodes = {};
        addExerciseToWorkout(item.id);
        // onBlurSearch();
        // addExerciseToWorkout({ name: item.name, associatedCodes, workoutExerciseType: item.WorkoutExerciseType });
      }}
      title={item.name}
      right={right}
    />
  ), [addExerciseToWorkout]);

  const renderActiveWorkoutItem = useCallback(({ item }) => (
    <List.Item
      style={{ backgroundColor: 'white' }}
      onPress={() => {
        navigation.navigate('Modal', { exercise: item });
      }}
      title={item.name}
    />
  ), [navigation]);

  const left = ({ ...props }) => (
    <IconButton
      {...props}
      icon='search'
    />
  );

  return (
    <View>
      <TextInput left={left} placeholder='Add or search exercises...' value={searchQuery} onChangeText={(text) => { setSearchQuery(text); }} autoFocus />
      {/* onBlur={onBlurSearch} */}
      <View style={styles.searchSuggestionContainer}>
        { searchQuery.length > 0 ? (
          <View style={styles.searchSuggestion}>
            <FlatList
              data={workoutsToShow}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
            {shouldShowAdd ? (
              <CreateExercises
                searchQuery={searchQuery}
                onCreate={(name) => {
                  const associatedCodes = {};
                  addExercise({ name, associatedCodes, workoutExerciseType: WorkoutExerciseType.GOOD_MORNING });
                }}
              />
            ) : null}
          </View>
        ) : null }
      </View>
      {exercisesInActiveWorkout && exercisesInActiveWorkout.length > 0 ? (
        <FlatList
          data={exercisesInActiveWorkout}
          renderItem={renderActiveWorkoutItem}
        />
      ) : <Text style={{ zIndex: 1, padding: 20, color: 'gray' }}>You have not added any exercises...</Text>}
    </View>
  );
}
/* { timer ? <Text>{ timer }</Text> : null } */
const styles = StyleSheet.create({
  searchSuggestionContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  searchSuggestion: {
    width: '95%',
    top: 0,
    zIndex: 10,
    position: 'absolute',
    backgroundColor: 'lightgray',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
