import {
  View, FlatList, Text, StyleSheet,
} from 'react-native';
import React, { useMemo, useCallback } from 'react';
import { Divider, IconButton, List } from 'react-native-paper';

import { RootTabScreenProps, WorkoutTemplate } from '../../types';
import GainsDataContext, {
  useWorkoutTemplates, useRemoveWorkout, useUpsertWorkoutTemplate,
} from '../contexts/GainsDataContext';

export default function WorkoutListScreen({ navigation }: RootTabScreenProps<'WorkoutListTab'>) {
  const workoutTemplate = useWorkoutTemplates();
  const removeWorkout = useRemoveWorkout();
  const upsertWorkoutTemplate = useUpsertWorkoutTemplate();
  // const workout = useWorkouts();
  // const workoutTemplatesList = useMemo(() => workoutTemplate.map(({ name, id }) => ({ name, id })), [workoutTemplate]);
  const workoutTemplateList = useMemo(() => workoutTemplate, [workoutTemplate]);

  // const favouriteWorkout = useCallback((exerciseIds: readonly string[], name: string, favourite: boolean, createdAt: string, workoutTemplateId?: string) => {
  //   const workout = workoutTemplate.find(({ id: workoutId }) => workoutId === workoutTemplateId);
  //   if (workout) {
  //     upsertWorkoutTemplate(workout.exerciseIds, workout.name, !workout.favourite, workout.createdAt, workoutTemplateId);
  //   }
  //   // upsertWorkoutTemplate({ ...workout, favourite: !workout.favourite });
  //   //   favourite: !workout.favourite, name: workout.name, exercisesId: workout.exercisesid, id,
  //   // );
  //   // workout.favourite = !workout.favourite;
  //   // upsertWorkoutTemplate(workout);
  // }, [upsertWorkoutTemplate, workoutTemplate]);

  // const addWorkoutToTemplate = useCallback((workout : Workout, favourite: boolean) => {
  //   const exerciseIds = workout.exercisesWithStatus.map((exercise) => exercise.exerciseId);
  //   const workoutTemplate = {
  //     exercisesId: exerciseIds,
  //     name: name === '' ? (`workoutTemplate: ${new Date().toLocaleString()}`) : name,
  //     favourite: !!favourite,
  //     createdAt: new Date().toLocaleString(),
  //     id: workout.id,
  //   };
  //   upsertWorkoutTemplate(workoutTemplate.exercisesId, workoutTemplate.name, workoutTemplate.favourite, workoutTemplate.createdAt, workoutTemplate.id);
  // }, [upsertWorkoutTemplate]

  const listItemBtns = useCallback(({ item }: { readonly item: WorkoutTemplate }) => (
    <View style={{ flexDirection: 'row' }}>
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
            <View>
              <List.Item title={item.name} description={`Created: ${item.createdAt.toLocaleDateString()}`} right={() => listItemBtns({ item })} style={styles.workoutTemplateListItem} onPress={() => {}} />
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
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
