import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react';
import {
  Pressable, SectionList, StyleSheet, TextInput,
} from 'react-native';
import {
  Divider,
  Headline, IconButton, List,
} from 'react-native-paper';
import {
  VictoryAxis, VictoryChart, VictoryScatter, VictoryTheme,
} from 'victory-native';

import { useThemeColor, Text, View } from '../components/Themed';
import useColorScheme from '../hooks/useColorScheme';
import { useSaveSet, useSetsForExercise, useGetTotalSetCountForExercise } from '../contexts/GainsDataContext';
import { RootStackScreenProps, ExerciseSet } from '../../types';
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
    <View
      lightColor='#8559da'
      darkColor='#512da8'
      style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%',
      }}
    >
      <IconButton size={25} style={{ flex: 1 }} disabled={minValue === value} animated icon='minus' onPress={() => onValueUpdated((p) => Math.max(minValue, p - 1))} />
      <View
        lightColor='#8559da'
        darkColor='#512da8'
        style={{ width: 100, flexDirection: 'row', justifyContent: 'center' }}
      >
        <Text
          style={{
            fontSize: 16, fontVariant: ['tabular-nums'], textAlign: 'center', alignSelf: 'center',
          }}
          // value={value.toString()}
          // onBlur={}
          // keyboardType='numeric'
        >
          {value}
        </Text>
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
  const exerciseId = exercise._id;
  const workoutId = React.useContext(CurrentWorkoutContext).activeWorkout?.id;
  const sets = useSetsForExercise(exerciseId);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(10);
  const saveSet = useSaveSet();
  const activeWorkoutSetCount = React.useContext(CurrentWorkoutContext).activeWorkout?.exercisesWithStatus;
  const getCompletedSetCountForExercise = useGetCompletedSetCountForExercise();
  const getTotalSetCountForExercise = useGetTotalSetCountForExercise();
  const themeColor = useThemeColor({ light: '#000000', dark: '#fff' }, 'text');
  const setCount = useMemo(() => getCompletedSetCountForExercise(exercise._id), [getCompletedSetCountForExercise, exercise._id]);
  const totalSetCount = useMemo(() => getTotalSetCountForExercise(exercise._id), [getTotalSetCountForExercise, exercise._id]);
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
          //
          style={{
            data: { fill: '#c43a31' },
          }}
          padding={{
            left: 10,
          }}
          domain={{ y: [0, 50] }}
          bubbleProperty='amount'
          maxBubbleSize={10}
          domainPadding={{ x: 10, y: 10 }}
          minBubbleSize={5}
          height={300}
          data={sets.map((s) => ({ x: s.createdAt, y: s.weight, amount: s.reps }))}
        />
        <VictoryAxis
          dependentAxis
          crossAxis
          domainPadding={{ x: 10, y: 10 }}
          orientation='left'
          tickFormat={(t) => `${t}kg` ?? '0kg'}
          // tickCount={5}
          style={{
            axis: { stroke: themeColor, strokeWidth: 1 },
            axisLabel: { fontSize: 15, padding: 30 },
            ticks: { stroke: '#ccc', size: 5 },
            tickLabels: {
              fontSize: 10, padding: 5, stroke: themeColor,
            },
          }}
        />
        <VictoryAxis
          tickFormat={() => ''}
          domainPadding={{ x: 10, y: 10 }}
          orientation='bottom'
          style={{
            axis: { stroke: themeColor, strokeWidth: 1 },
            axisLabel: { fontSize: 10, padding: 10 },
            ticks: { stroke: '#ccc', size: 5 },
            tickLabels: { fontSize: 10, padding: 5, stroke: themeColor },
          }}
        />
      </VictoryChart>
      <Divider style={{ height: 1 }} />
      <SectionList
        sections={setsPerDay}
        initialNumToRender={5}
        style={{ width: '100%' }}
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
      <View lightColor='#8559da' darkColor='#512da8' style={styles.stepperContainer}>
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
      </View>
      {/* </Portal.Host> */}
      <ExerciseModal />
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepperContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: 'lightgray',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    // position: 'absolute',
    bottom: 92,
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
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
