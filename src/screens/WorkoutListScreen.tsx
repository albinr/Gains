import {
  View, FlatList, Text, StyleSheet,
} from 'react-native';
import React, { useMemo, useCallback } from 'react';
import { Divider, IconButton, List } from 'react-native-paper';

import { RootTabScreenProps } from '../../types';
import GainsDataContext, {
  useWorkoutTemplates, useRemoveWorkout,
} from '../contexts/GainsDataContext';

export default function WorkoutListScreen({ navigation }: RootTabScreenProps<'WorkoutListTab'>) {
  const workoutTemplate = useWorkoutTemplates();
  const removeWorkout = useRemoveWorkout();
  // const upsertWorkoutTemplate = useUpsertWorkoutTemplate();
  // const workout = useWorkouts();
  // const workoutTemplatesList = useMemo(() => workoutTemplate.map(({ name, id }) => ({ name, id })), [workoutTemplate]);
  const workoutTemplateList = useMemo(() => { console.log('workoutTemplatesList', workoutTemplate); return workoutTemplate; }, [workoutTemplate]);
  // const removeBtn = useCallback(({ item }) => (
  //   <IconButton
  //     icon='close'
  //     onPress={(() => { console.log('remove', item.id); removeExercise(item.id); })}
  //   />
  // ), [removeExercise]);

  // console.log('workoutTemplatesList', workoutTemplate);
  const listItemBtns = useCallback(({ item }) => (
    <View style={{ flexDirection: 'row' }}>
      <IconButton icon='star-outline' onPress={() => console.log('Pressed')} />
      <IconButton icon='trash-can-outline' onPress={() => { removeWorkout(item.id); }} />
    </View>
  ), [removeWorkout]);

  return (
    <View style={styles.container}>
      {workoutTemplate && workoutTemplate.length > 0 ? (
        <FlatList
          data={workoutTemplateList}
          renderItem={({ item }) => (
            <View>
              <List.Item title={item.name} description={item.name} right={listItemBtns} style={{ backgroundColor: '#fff' }} onPress={() => {}} />
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
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
