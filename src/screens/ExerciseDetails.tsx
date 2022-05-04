import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { StatusBar } from 'expo-status-bar';
import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import {
  Platform, Pressable, ScrollView, SectionList, StyleSheet, TextInput, View,
} from 'react-native';
import {
  Headline, IconButton, List, ThemeProvider, Portal,
} from 'react-native-paper';
import {
  Background, VictoryAxis, VictoryChart, VictoryScatter,
} from 'victory-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text } from '../components/Themed';
import { useSaveSet, useSetsForExercise, useGetTotalSetCountForExercise } from '../contexts/GainsDataContext';
import { RootStackScreenProps, ExerciseSet } from '../../types';
import Colors from '../../constants/Colors';
import ExerciseModal from '../components/modals/DragableExersiceModal';
import CurrentWorkoutContext, { useGetCompletedSetCountForExercise } from '../contexts/CurrentWorkoutDataContext';

dayjs.extend(calendar, {
  sameDay: '[Today at] h:mm A', // The same day (Today at 2:30 AM)
  nextDay: '[Tomorrow]', // The next day (Tomorrow at 2:30 AM)
  nextWeek: 'dddd', // The next week (Sunday at 2:30 AM)
  lastDay: '[Yesterday]', // The day before ( Yesterday at 2:30 AM )
  lastWeek: '[Last] dddd', // Last week ( Last Monday at 2:30 AM )
  sameElse: 'DD/MM/YYYY', // Everything else ( 7/10/2011 )
});

const Stepper: React.FC<{ readonly minValue?: number, readonly value: number, readonly textTitle: string, readonly onValueUpdated: React.Dispatch<React.SetStateAction<number>> }> = ({
  textTitle, onValueUpdated, value, minValue = 0,
}) => {
  const InputValue = useCallback(() => {
    let val;
    if (value) {
      val = value;
    }
  }, [value]);

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%',
    }}
    >
      <IconButton size={25} style={{ flex: 1 }} disabled={minValue === value} animated icon='minus' onPress={() => onValueUpdated((p) => Math.max(minValue, p - 1))} />
      <View style={{ width: 100, flexDirection: 'row', justifyContent: 'center' }}>
        <TextInput
          style={{
            fontSize: 16, fontVariant: ['tabular-nums'], textAlign: 'center', alignSelf: 'center',
          }}
          value={value.toString()}
          // onBlur={}
          keyboardType='numeric'
        />
        <Text style={{
          fontSize: 10, fontVariant: ['tabular-nums'], textAlign: 'center', alignSelf: 'center', paddingLeft: 4,
        }}
        >
          {textTitle}
        </Text>
      </View>
      <IconButton size={25} style={{ flex: 1 }} animated icon='plus' onPress={() => onValueUpdated((p) => Math.max(minValue, p + 1))} />
    </View>
  );
};

export default function ModalScreen({ navigation, route: { params: { exercise } } }: RootStackScreenProps<'Modal'>) {
  const exerciseId = exercise.id;
  const workoutId = React.useContext(CurrentWorkoutContext).activeWorkout?.id;
  const sets = useSetsForExercise(exerciseId);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(10);
  const saveSet = useSaveSet();
  const activeWorkoutSetCount = React.useContext(CurrentWorkoutContext).activeWorkout?.exercisesWithStatus;
  const getCompletedSetCountForExercise = useGetCompletedSetCountForExercise();
  const getTotalSetCountForExercise = useGetTotalSetCountForExercise();

  const setCount = useMemo(() => getCompletedSetCountForExercise(exercise.id), [getCompletedSetCountForExercise, exercise.id]);
  const totalSetCount = useMemo(() => getTotalSetCountForExercise(exercise.id), [getTotalSetCountForExercise, exercise.id]);
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
      title: `${exercise.name}`,

    });
  }, [navigation, exercise]);
  return (

    <View style={styles.container}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      {/* <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} /> */}
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
      <Text>Set Log</Text>
      <SectionList
        sections={setsPerDay}
        style={{ width: '100%', flex: 1 }}
        renderSectionHeader={({ section: { title } }) => (
          <Headline style={{ paddingHorizontal: 10 }}>{title}</Headline>
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
      {/* <Portal.Host> */}
      <View style={styles.stepperContainer}>
        <Stepper value={weight} onValueUpdated={setWeight} textTitle='KG' />
        <Pressable
          style={styles.saveSetBtn}
          onPressIn={() => {
            if (workoutId) {
              saveSet({
                reps, weight, exerciseId, workoutId,
              });
            }
          }}
        >
          <Text>
            SAVE SET

          </Text>
          <Text>
            {setCount}
            {' '}
            /
            {' '}
            {totalSetCount}
          </Text>
        </Pressable>
        <Stepper minValue={1} value={reps} onValueUpdated={setReps} textTitle='REPS' />
        <View style={{ height: 100 }} />
      </View>
      {/* </Portal.Host> */}
      <ExerciseModal />
    </View>

  );
}
/* <View style={{
        width: '100%', height: 100, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc',
      }}
      >
        <IconButton icon='arrow-left' onPress={() => { navigation.navigate('Root'); }} />
        <Text>{exercise.name}</Text>
      </View> */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },
  stepperContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'lightgray',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    // position: 'absolute',
    // bottom: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  saveSetBtn: {
    width: 100,
    height: 80,
    borderRadius: 30,
    borderColor: 'black',
    borderWidth: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
/* <View style={{
        width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: 'gray',
      }}
      >
        <View style={{
          justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse',
        }}
        >

          <Text style={{ padding: 10 }}>00:00</Text>
          <IconButton icon='pause' color='black' size={35} onPress={() => console.log('Pressed')} />
        </View>
        <View style={{
          justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse',
        }}
        >
          <IconButton icon='arrow-right' color='black' size={35} onPress={() => console.log('Pressed')} />

        </View>
      </View> */
