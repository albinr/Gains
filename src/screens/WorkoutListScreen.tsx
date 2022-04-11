import React, {
  useContext, useEffect, useMemo, useState, useRef, useCallback,
} from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import {
  Button, Dialog, List, Portal,
  Searchbar, Text, TextInput, Title, useTheme, IconButton,
} from 'react-native-paper';

import useBoolState from '../hooks/useBoolState';
import { RootTabScreenProps } from '../../types';
import { AuthContext } from '../contexts/AuthContext';
import { useWorkouts, useAddWorkout } from '../contexts/WorkoutDataContext';
import { WorkoutExerciseType } from '../../clients/__generated__/schema';

/* const CreateExercises: React.FC<{ readonly searchQuery: string, readonly onCreate: (name: string) => void }> = ({
  searchQuery, onCreate,
}) => {
  const workoutName = useRef('');

  const onCreateExercises = useCallback(() => {
    if (searchQuery.length > 0) {
      workoutName.current = searchQuery;
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.length < 0) {
      workoutName.current = '';
    }
  }, [searchQuery.length]);

  return (
    <View>
      hello
    </View>
  );
}; */

export default function WorkoutListScreen({ navigation }: RootTabScreenProps<'WorkoutListTab'>) {
  const workouts = useWorkouts();
  const addWorkout = useAddWorkout();
  const { logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const workoutsToShow = useMemo(() => (searchQuery.length > 0
    ? workouts.filter((w) => w.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))
    : workouts), [searchQuery, workouts]);

  useEffect(() => {
    navigation.setOptions({

    });
  }, [navigation]);

  return (
    <View>
      {/* onIconPress={addWorkout({ searchQuery })} */}
      {/* <Searchbar placeholder='Add or search exercises..' value={searchQuery} onChangeText={setSearchQuery} autoFocus /> */}
      <TextInput placeholder='Add or search exercises..' value={searchQuery} onChangeText={(text) => { setSearchQuery(text); }} />
      {searchQuery.length > 0 ? (
        <List.Item
          title={searchQuery}
          description='Add Exercise'
          right={(props) => (
            <IconButton
              {...props}
              icon='plus'
              onPress={() => {
                const associatedCodes = {};
                addWorkout({ name: searchQuery, associatedCodes, workoutExerciseType: WorkoutExerciseType.GOOD_MORNING });
              }}
            />
          )}
        />
      ) : null }
      <FlatList
        data={workoutsToShow}
        style={{ width: '100%' }}
        renderItem={({ item }) => (
          <List.Item
            onPress={() => {
              navigation.navigate('Modal', { workout: item });
            }}
            title={item.name}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      {/*    { item.name !==  searchQuery ? (
            <Button style={{ backgroundColor: 'red' }} onPress={() => (addOrSearchExercises)}>+</Button>
          ) : null} */}
      {/*  <FlatList
        data={workoutsToShow}
        style={{ width: '100%' }}
        renderItem={({ item }) => (
          <List.Item
            onPress={() => {
              navigation.navigate('Modal', { workout: item });
            }}
            title={item.name}
          />
        )}
      /> */}
      {/* <Button onPress={() => addOrSearchExercises}>+</Button> */}
    </View>
  );
}
