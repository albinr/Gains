import React, {
  useEffect, useMemo, useState, useRef, useCallback,
} from 'react';
import {
  StyleSheet, Pressable, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
  List, IconButton, Divider, TextInput,
} from 'react-native-paper';
// import { ThemeProvider } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { View, Text } from '../components/Themed';
import { RootTabScreenProps, ExerciseDefaultFragment } from '../../types';
import {
  useExercises, useAddExercise, useWorkouts, useSearchForExercises,
} from '../contexts/GainsDataContext';
import CurrentWorkoutContext, {
  useStartTimer, useStartWorkout, useAddExerciseToWorkout, useRemoveExercise,
} from '../contexts/CurrentWorkoutDataContext';
// import { WorkoutExerciseType } from '../../clients/__generated__/schema';
import { StartWorkoutButton } from '../components/StartWorkout';
import { primary } from '../../constants/Colors';

const CreateExercises: React.FC<{ readonly searchQuery: string, readonly onCreate: (name: string) => void }> = ({
  searchQuery, onCreate,
}) => {
  const workoutName = useRef('');

  const onCreateExercises = useCallback(() => {
    onCreate(searchQuery);
  }, [onCreate, searchQuery]);

  const right = ({ ...props }) => (
    <View style={styles.centering}>
      <IconButton
        {...props}
        icon='plus'
      // onPress={onCreateExercises}
      />
    </View>
  );
  return (
    <List.Item
      title={searchQuery}
      description='Add Custom Exercise'
      right={right}
      onPress={() => {}}
      style={{
        // borderColor: 'blue',
        // borderWidth: 1,
        // backgroundColor: '#ccc',
      }}
    />
  );
};

const normalizeString = (str: string) => {
  const normalized = str.toLocaleLowerCase().trim();
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
  const [data, setData] = useState(exercisesInActiveWorkout);

  const exercisesToShow = useMemo(() => (searchQuery.length > 0
    ? searchForExercises(searchQuery)
    : exercises), [searchQuery, exercises, searchForExercises]);

  const shouldShowAdd = useMemo(() => searchQuery.length > 0
    && !exercisesToShow.find((w) => normalizeString(searchQuery) === normalizeString(w.name)), [searchQuery, exercisesToShow]);

  useEffect(() => {
    if (!activeWorkout) {
      startWorkout();
    }
  }, [startWorkout, activeWorkout]);

  useEffect(() => {
    navigation.setOptions({
    });
  }, [navigation]);

  const onPress = useCallback((item: ExerciseDefaultFragment) => {
    if (activeWorkout && !exercisesInActiveWorkout.find((id) => id._id === item._id)) {
      console.log('adding exercise to workout');
      return addExerciseToWorkout(item._id);
    } return null;
  }, [addExerciseToWorkout, activeWorkout, exercisesInActiveWorkout]);

  const searchItem = useCallback(({ item }: { readonly item: ExerciseDefaultFragment }) => {
    const right = ({ ...props }) => (
      <View style={styles.centering}>
        <IconButton
          {...props}
          // icon={activeWorkout && !exercisesInActiveWorkout.find((id) => id._id === item._id) ? 'plus' : 'check'}
          icon='plus'
          onPress={() => onPress(item)}
        />
      </View>
    );
    if (activeWorkout && !exercisesInActiveWorkout.find((id) => id._id === item._id)) {
      return (
        <View
          lightColor='#FFFFFF'
          darkColor='#1E1E1E'
        >
          <List.Item
            onPress={() => {
              onPress(item);
              // onBlurSearch();
              setSearchQuery('');
              Keyboard.dismiss();
            }}
            title={item.name}
            right={right}
          />
          <Divider style={{ height: 1 }} />
        </View>
      );
    }
    return null;
  }, [onPress, exercisesInActiveWorkout, activeWorkout]);

  const removeBtn = useCallback(({ item }) => (
    <IconButton
      icon='close'
      onPress={() => removeExercise(item._id)}
    />
  ), [removeExercise]);

  const renderActiveWorkoutItem = useCallback(({ item }: { readonly item: ExerciseDefaultFragment }) => {
    console.log('renderActiveWorkoutItem', item);
    return (
      <View lightColor='#FFFFFF' darkColor='#1E1E1E'>
        <List.Item
          // style={{ backgroundColor: '#fff' }}
          onPress={() => {
            navigation.navigate('Modal', { exercise: item });
          }}
          title={item.name}
          right={() => removeBtn({ item })}
        />
        <Divider style={{ height: 1 }} />
      </View>
    );
  }, [navigation, removeBtn]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder='Add or search exercises...'
        value={searchQuery}
        onChangeText={(text) => { setSearchQuery(text); }}
        onSubmitEditing={() => setSearchQuery('')}
        left={<TextInput.Icon name='magnify-plus-outline' />}
        right={searchQuery.length > 0 ? (<TextInput.Icon name='close' onPress={() => { setSearchQuery(''); Keyboard.dismiss(); }} />) : null}
      />
      { searchQuery.length > 0 ? (
        <View style={styles.searchSuggestionContainer}>
          {searchQuery.length > 0 ? (

            <Pressable
              onPress={() => { setSearchQuery(''); Keyboard.dismiss(); }}
              style={styles.pressable}
            />

          ) : null}
          <View style={styles.searchSuggestion}>
            <FlatList
              data={exercisesToShow}
              renderItem={searchItem}
              keyExtractor={(item) => item._id}
              onScrollBeginDrag={() => Keyboard.dismiss()}
            />

            {shouldShowAdd ? (
              <View>
                <Divider style={{ height: 1, backgroundColor: primary }} />
                <CreateExercises
                  searchQuery={searchQuery}
                  onCreate={(name) => {
                    // addExerciseToWorkout(item.id);
                    const associatedCodes = {};
                    // addExercise({ name, associatedCodes, workoutExerciseType: WorkoutExerciseType.GOOD_MORNING });
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
          contentContainerStyle={{ paddingBottom: 130 }}
          renderItem={renderActiveWorkoutItem}
          keyExtractor={(item, index) => item._id}
        />

      ) : (
        <View style={styles.textContainer}>
          <Text style={{
            padding: 20, color: 'gray', zIndex: 5, marginTop: -70,
          }}
          >
            You have not added any exercises...
          </Text>
        </View>
      )}
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
    position: 'absolute',
    alignItems: 'center',
    top: 70,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    // backgroundColor: '#fff',
    // borderColor: 'red',
    // borderWidth: 2,
  },
  searchSuggestion: {
    width: '75%',
    maxHeight: '100%',
    // borderColor: 'green',
    // borderWidth: 2,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    zIndex: 20,
    height: 70,
  },
  pressable: {
    flex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
    zIndex: 0,
    // elevation: 0,
  },
  centering: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
