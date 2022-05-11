import {
  FlatList, StyleSheet,
} from 'react-native';
import React, { useMemo, useCallback } from 'react';
import { Divider, IconButton, List } from 'react-native-paper';

import { View, Text } from '../components/Themed';
import { RootTabScreenProps, WorkoutTemplate } from '../../types';
import GainsDataContext, {
  useWorkoutTemplates, useRemoveWorkout, useUpsertWorkoutTemplate,
} from '../contexts/GainsDataContext';
import { useStartWorkout } from '../contexts/CurrentWorkoutDataContext';

export default function WorkoutListScreen({ navigation }: RootTabScreenProps<'WorkoutListTab'>) {
  const workoutTemplate = useWorkoutTemplates();
  const removeWorkout = useRemoveWorkout();
  const upsertWorkoutTemplate = useUpsertWorkoutTemplate();
  const startWorkout = useStartWorkout();
  // const workout = useWorkouts();
  // const workoutTemplatesList = useMemo(() => workoutTemplate.map(({ name, id }) => ({ name, id })), [workoutTemplate]);
  const workoutTemplateList = useMemo(() => workoutTemplate, [workoutTemplate]);

  const onPress = useCallback((item: WorkoutTemplate) => {
    if (item) {
      console.log('start workout', item);
      startWorkout(item.id);
      navigation.navigate('ExerciseListTab');
    } return null;
  }, [startWorkout, navigation]);

  const listItemBtns = useCallback(({ item }: { readonly item: WorkoutTemplate }) => (
    <View lightColor='#FFFFFF' darkColor='#1E1E1E' style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <IconButton icon={item.favourite ? ('star') : ('star-outline')} onPress={() => { upsertWorkoutTemplate(item.exerciseIds, item.name, !item.favourite, item.createdAt, item.id); }} />
      <IconButton icon='trash-can-outline' onPress={() => removeWorkout(item.id)} />
    </View>
  ), [removeWorkout, upsertWorkoutTemplate]);

  return (
    <View style={styles.container}>
      {workoutTemplate && workoutTemplate.length > 0 ? (
        <FlatList
          data={workoutTemplateList}
          // keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View lightColor='#FFFFFF' darkColor='#1E1E1E'>
              <List.Item
                title={item.name}
                description={`Created: ${item.createdAt.toLocaleDateString()}`}
                right={() => listItemBtns({ item })}
                style={styles.workoutTemplateListItem}
                onPress={() => onPress(item)}
              />
              <Divider />
            </View>
          )}
        />
      ) : <View style={styles.textContainer}><Text style={{ padding: 20, color: 'gray', zIndex: 5 }}>You have no previous workout templates</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  workoutTemplateListItem: {
    // backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
