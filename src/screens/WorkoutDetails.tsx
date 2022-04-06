import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Platform, SectionList, StyleSheet, TextInput,
} from 'react-native';
import {
  Button, Headline, IconButton, List,
} from 'react-native-paper';
import { VictoryAxis, VictoryChart, VictoryScatter } from 'victory-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useSaveSet, useSetsForWorkout } from '../contexts/WorkoutDataContext';
import { RootStackScreenProps, ExerciseSet } from '../../types';

dayjs.extend(calendar, {
  sameDay: '[Today at] h:mm A', // The same day ( Today at 2:30 AM )
  nextDay: '[Tomorrow]', // The next day ( Tomorrow at 2:30 AM )
  nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
  lastDay: '[Yesterday]', // The day before ( Yesterday at 2:30 AM )
  lastWeek: '[Last] dddd', // Last week ( Last Monday at 2:30 AM )
  sameElse: 'DD/MM/YYYY', // Everything else ( 7/10/2011 )
});

const Stepper: React.FC<{ readonly minValue?: number, readonly value: number, readonly onValueUpdated: React.Dispatch<React.SetStateAction<number>> }> = ({ onValueUpdated, value, minValue = 0 }) => {
  const InputValue = useCallback(() => {
    let val;
    if (value) {
      val = value;
    }
  }, [value]);

  return (

    <View style={{ flexDirection: 'row' }}>
      <IconButton disabled={minValue === value} animated icon='minus' onPress={() => onValueUpdated((p) => Math.max(minValue, p - 1))} style={{ flex: 1 }} />
      <Text style={{
        width: 50, fontSize: 30, fontVariant: ['tabular-nums'], textAlign: 'center', alignSelf: 'center',
      }}
      >
        { value.toString() }
      </Text>
      {/* <TextInput
        style={{
          width: 50, fontSize: 30, fontVariant: ['tabular-nums'], textAlign: 'center', alignSelf: 'center',
        }}
        value={value.toString()}
        onBlur={}
        keyboardType='numeric'
      /> */}
      <IconButton animated icon='plus' onPress={() => onValueUpdated((p) => Math.max(minValue, p + 1))} style={{ flex: 1 }} />
    </View>
  );
};
export default function ModalScreen({ navigation, route: { params: { workout } } }: RootStackScreenProps<'Modal'>) {
  const workoutId = workout.id;
  const sets = useSetsForWorkout(workoutId);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(10);
  const saveSet = useSaveSet();

  useEffect(() => {
    if (sets[0]) {
      setReps(sets[0].reps);
      setWeight(sets[0].weight);
    }
  }, [sets]);

  const setsPerDay = React.useMemo(() => sets.reduce<readonly {readonly title: string, readonly data: readonly ExerciseSet[]}[]>((acc, set) => {
    const title = dayjs(set.createdAt).startOf('day').calendar(null, {
      sameDay: '[Today]', // The same day ( Today at 2:30 AM )
      nextDay: '[Tomorrow]', // The next day ( Tomorrow at 2:30 AM )
      nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
      lastDay: '[Yesterday]', // The day before ( Yesterday at 2:30 AM )
      lastWeek: '[Last] dddd', // Last week ( Last Monday at 2:30 AM )
      sameElse: 'DD/MM/YYYY', // Everything else ( 7/10/2011 )
    });
    const foundEntry = acc.find((s) => s.title === title);
    return foundEntry ? [...acc.filter((s) => s.title !== title), { title, data: [...foundEntry.data, set] }] : [...acc, { title, data: [set] }];
  }, []), [sets]);

  useEffect(() => {
    navigation.setOptions({
      title: `${workout.name}`,
    });
  }, [navigation, workout]);

  return (
    <View style={styles.container}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <Text>Reps</Text>
      <Stepper minValue={1} value={reps} onValueUpdated={setReps} />
      <Text>Weight (kg)</Text>
      <Stepper value={weight} onValueUpdated={setWeight} />

      <Button mode='contained' style={{ width: '90%', maxWidth: 400 }} contentStyle={{ padding: 20 }} icon='check' onPress={() => saveSet({ reps, weight, workoutId })}>Save set</Button>
      <VictoryChart>
        <VictoryScatter
          style={{ data: { fill: '#c43a31' } }}
          bubbleProperty='amount'
          maxBubbleSize={10}
          domainPadding={{ x: 10, y: 10 }}
          minBubbleSize={5}
          height={200}
          data={sets.map((s) => ({ x: s.createdAt, y: s.weight, amount: s.reps }))}

        />
        <VictoryAxis dependentAxis crossAxis domainPadding={{ x: 10, y: 10 }} orientation='left' />
        <VictoryAxis tickFormat={() => ''} domainPadding={{ x: 10, y: 10 }} orientation='bottom' />
      </VictoryChart>

      <SectionList
        sections={setsPerDay}
        style={{ width: '100%' }}
        renderSectionHeader={({ section: { title } }) => (
          <Headline style={{ padding: 10 }}>{title}</Headline>
        )}
        renderItem={({ item }) => (
          <List.Item
            title={(
              <Text>
                { `${item.reps} reps @ `}
                <Text style={{ fontWeight: 'bold' }}>{`${item.weight} kg`}</Text>
              </Text>
            )}
            description={dayjs(item.createdAt).format('hh:mm')}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
