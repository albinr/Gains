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
import { useExercises, useAddExercise } from '../contexts/WorkoutDataContext';
import { WorkoutExerciseType } from '../../clients/__generated__/schema';

const CreateExercises: React.FC<{ readonly searchQuery: string, readonly onCreate: (name: string) => void }> = ({
  searchQuery, onCreate,
}) => {
  const workoutName = useRef('');

  const onCreateExercises = useCallback(() => {
    onCreate(searchQuery);
  }, [onCreate, searchQuery]);

  /*   useEffect(() => {
    if (searchQuery.length < 0) {
      searchQuery = '';
    }
  }, [searchQuery.length]); */
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
  console.log('normalized', normalized);
  return normalized;
};

export default function WorkoutListScreen({ navigation }: RootTabScreenProps<'WorkoutListTab'>) {
  const exercises = useExercises();
  const addExercise = useAddExercise();
  const { logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const workoutsToShow = useMemo(() => (searchQuery.length > 0
    ? exercises.filter((w) => w.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))
    : exercises), [searchQuery, exercises]);

  const shouldShowAdd = useMemo(() => searchQuery.length > 0
    && !workoutsToShow.find((w) => normalizeString(searchQuery) === normalizeString(w.name)), [searchQuery, workoutsToShow]);

  useEffect(() => {
    navigation.setOptions({
    });
  }, [navigation]);

  const renderItem = useCallback(({ item }) => (
    <List.Item
      onPress={() => {
        navigation.navigate('Modal', { workout: item });
      }}
      title={item.name}
    />
  ), [navigation]);

  return (
    <View>
      {/* onIconPress={addWorkout({ searchQuery })} */}
      {/* <Searchbar placeholder='Add or search exercises..' value={searchQuery} onChangeText={setSearchQuery} autoFocus /> */}
      <TextInput placeholder='Add or search exercises..' value={searchQuery} onChangeText={(text) => { setSearchQuery(text); }} />
      {/* {searchQuery.length > 0 ? (
        <CreateExercises
          searchQuery={searchQuery}
          onCreate={(name) => {
            const associatedCodes = {};
            addExercise({ name, associatedCodes, workoutExerciseType: WorkoutExerciseType.GOOD_MORNING });
          }}
        />
      ) : null } */}
      {/*
      <FlatList
        data={workoutsToShow}
        style={{ width: '100%' }}
        renderItem={(
          <List.Item
            onPress={() => {
              navigation.navigate('Modal', { workout: item });
            }}
            title={item.name}
          />
        )}
      /> */}
      <FlatList
        data={workoutsToShow}
        style={{ width: '100%' }}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      { shouldShowAdd ? (
        <CreateExercises
          searchQuery={searchQuery}
          onCreate={(name) => {
            const associatedCodes = {};
            addExercise({ name, associatedCodes, workoutExerciseType: WorkoutExerciseType.GOOD_MORNING });
          }}
        />
      ) : null }
    </View>
  );
}
