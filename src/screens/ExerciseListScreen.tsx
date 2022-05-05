import React, {
  useEffect, useMemo, useState, useRef, useCallback,
} from 'react';
import {
  StyleSheet, View, FlatList, Pressable,
} from 'react-native';
import {
  List, Text, TextInput, IconButton, Divider,
} from 'react-native-paper';
import { ThemeProvider } from '@react-navigation/native';

import { RootTabScreenProps } from '../../types';
import {
  useExercises, useAddExercise, useWorkouts, useSearchForExercises,
} from '../contexts/GainsDataContext';
import CurrentWorkoutContext, {
  useStartTimer, useStartWorkout, useAddExerciseToWorkout, useRemoveExercise,
} from '../contexts/CurrentWorkoutDataContext';
import { WorkoutExerciseType } from '../../clients/__generated__/schema';
import { StartWorkoutButton } from '../components/StartWorkout';

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
      // onPress={onCreateExercises}
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
export default function ExerciseListScreen({ navigation }: RootTabScreenProps<'ExerciseListTab'>) {
  const exercises = useExercises();
  const addExerciseToWorkout = useAddExerciseToWorkout();
  const addExercise = useAddExercise();
  const workout = useWorkouts();
  const startWorkout = useStartWorkout();
  const removeExercise = useRemoveExercise();
  const timer = useStartTimer();
  const { activeWorkout, exercisesInActiveWorkout } = React.useContext(CurrentWorkoutContext);
  const searchForExercises = useSearchForExercises();
  const [searchQuery, setSearchQuery] = useState('');

  const workoutsToShow = useMemo(() => (searchQuery.length > 0
    ? searchForExercises(searchQuery)
    : exercises), [searchQuery, exercises, searchForExercises]);

  const shouldShowAdd = useMemo(() => searchQuery.length > 0
    && !workoutsToShow.find((w) => normalizeString(searchQuery) === normalizeString(w.name)), [searchQuery, workoutsToShow]);

  useEffect(() => {
    startWorkout();
  }, [startWorkout]);

  // console.log('Workout: ', [workout], 'activeWorkout: ', activeWorkout?.exerciseIds);

  useEffect(() => {
    navigation.setOptions({
    });
  }, [navigation]);

  const onPress = useCallback((item) => {
    if (activeWorkout && !activeWorkout.exercisesWithStatus.find((id) => id === item.id)) {
      addExerciseToWorkout(item.id);
      console.log('added', item.id);
    }
  }, [addExerciseToWorkout, activeWorkout]);

  const renderItem = useCallback(({ item }) => {
    const right = ({ ...props }) => (
      <IconButton
        {...props}
        icon='plus'
      />
    );

    return (
      <List.Item
        onPress={() => {
          onPress(item);
          console.log(item.name, 'item has been pressed');
          // onBlurSearch();
        }}
        title={item.name}
        right={right}
      />
    );
  }, [onPress]);

  const removeBtn = useCallback(({ item }) => (
    <IconButton
      icon='close'
      onPress={(() => { console.log('remove', item.id); removeExercise(item.id); })}
    />
  ), [removeExercise]);

  const renderActiveWorkoutItem = useCallback(({ item }) => (
    <View>
      <List.Item
        style={{ backgroundColor: 'white' }}
        onPress={() => {
          navigation.navigate('Modal', { exercise: item });
        }}
        title={item.name}
        right={() => removeBtn({ item })}
      />
      <Divider />
    </View>
  ), [navigation, removeBtn]);

  return (
    <View style={styles.container}>
      <TextInput
        style={{ zIndex: 15, elevation: 2 }}
        placeholder='Add or search exercises...'
        value={searchQuery}
        onChangeText={(text) => { setSearchQuery(text); }}
        onSubmitEditing={() => setSearchQuery('')}
        left={<TextInput.Icon name='magnify' />}
        // onBlur={() => console.log('you have been blured')}
      />
      {searchQuery.length > 0 ? (
        <Pressable
          onPress={() => setSearchQuery('')}
          style={{
            flex: 1, top: 0, bottom: 0, right: 0, left: 0, position: 'absolute', zIndex: 10, elevation: 2,
          }}
        />
      ) : null}
      { searchQuery.length > 0 ? (
        <View style={styles.searchSuggestionContainer}>

          <View style={styles.searchSuggestion}>
            <FlatList
              data={workoutsToShow}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 200 }}
            />

            {shouldShowAdd ? (
              <View>
                <Divider />
                <CreateExercises
                  searchQuery={searchQuery}
                  onCreate={(name) => {
                    // addExerciseToWorkout(item.id);
                    const associatedCodes = {};
                    addExercise({ name, associatedCodes, workoutExerciseType: WorkoutExerciseType.GOOD_MORNING });
                  }}
                />

              </View>
            ) : null}
          </View>

        </View>
      ) : null }
      {exercisesInActiveWorkout && exercisesInActiveWorkout.length > 0 ? (
        <FlatList
          data={exercisesInActiveWorkout}
          renderItem={renderActiveWorkoutItem}
        />

      ) : <View style={styles.textContainer}><Text style={{ padding: 20, color: 'gray', zIndex: 5 }}>You have not added any exercises...</Text></View>}
      {exercisesInActiveWorkout && exercisesInActiveWorkout.length > 0 ? (
        <StartWorkoutButton
          startingExercise={exercisesInActiveWorkout}
          onStart={(item) => { navigation.navigate('Modal', { exercise: item }); }}
        />
      ) : null}

    </View>
  );
}
/* { timer ? <Text>{ timer }</Text> : null } */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSuggestionContainer: {
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSuggestion: {
    position: 'absolute',
    width: '85%',
    zIndex: 15,
    elevation: 5,
    top: 0,
    backgroundColor: '#ccc',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});
