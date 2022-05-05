import {
  View, FlatList, Text,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { Divider, List } from 'react-native-paper';

import { styles } from '../../constants/Styles';
import { RootTabScreenProps } from '../../types';
import GainsDataContext, {
  useWorkoutTemplates,
} from '../contexts/GainsDataContext';

export default function WorkoutListScreen({ navigation }: RootTabScreenProps<'WorkoutListTab'>) {
  const workoutTemplate = useWorkoutTemplates();
  // const upsertWorkoutTemplate = useUpsertWorkoutTemplate();
  // const workout = useWorkouts();
  // const workoutTemplatesList = useMemo(() => workoutTemplate.map(({ name, id }) => ({ name, id })), [workoutTemplate]);

  const workoutTemplateList = useMemo(() => { console.log('workoutTemplatesList', workoutTemplate); return workoutTemplate; }, [workoutTemplate]);

  console.log('WorkoutListScreen');

  // console.log('workoutTemplatesList', workoutTemplate);

  return (
    <View>
      {workoutTemplate && workoutTemplate.length > 0 ? (
        <FlatList
          data={workoutTemplateList}
          inverted
          renderItem={({ item }) => (
            <View>
              <List.Item title={item.name} />
              <Divider />
            </View>
          )}
        />
      ) : <Text>No workout templates</Text>}
    </View>
  );
}
