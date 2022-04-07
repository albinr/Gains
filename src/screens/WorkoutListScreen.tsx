import React, {
  useContext, useEffect, useMemo, useState, useRef, useCallback,
} from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import {
  Button, Dialog, List, Portal,
  Searchbar, Text, TextInput, useTheme,
} from 'react-native-paper';

import useBoolState from '../hooks/useBoolState';
import { RootTabScreenProps } from '../../types';
import { AuthContext } from '../contexts/AuthContext';
import { useWorkouts, useAddWorkout } from '../contexts/WorkoutDataContext';

export default function WorkoutListScreen({ navigation }: RootTabScreenProps<'WorkoutListTab'>) {
  const workouts = useWorkouts();
  const addWorkout = useAddWorkout();
  const { logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');

  const workoutsToShow = useMemo(() => (searchQuery.length > 0
    ? workouts.filter((w) => w.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))
    : workouts), [searchQuery, workouts]);

  const workoutName = useRef('');

  const addOrSearchExercises = useCallback(() => {
    if (searchQuery.length > 0) {
      workoutName.current = searchQuery;
    }
  }, [searchQuery]);

  /* useEffect(() => {
    if (searchQuery.length <= 0) {
      workoutName.current = '';
    }
  }, [searchQuery.length]); */

  /*  useEffect(() => {
    navigation.setOptions({

    });
  }, [navigation]); */

  return (
    <View>
      {/* onIconPress={addWorkout({ searchQuery })} */}
      <Searchbar placeholder='Add or search exercises..' value={searchQuery} onChangeText={setSearchQuery} autoFocus />
      {/*    <FlatList
        data={[addOrSearchExercises]}
        style={{ width: '100%' }}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
          />
        )}
      /> */}
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
      />
      {/* <Button onPress={() => addOrSearchExercises}>+</Button> */}
    </View>
  );
}
