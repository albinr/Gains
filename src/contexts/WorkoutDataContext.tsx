import React, { useCallback, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';

import { ExerciseSet, Exercise } from '../../types';
import { WorkoutExerciseType } from '../../clients/__generated__/schema';

// void AsyncStorage.clear();

type Workout = {
  readonly id: string;
  readonly exercises: readonly Exercise[];
  readonly startTime: Date;
  readonly endTime?: Date;
}

type WorkoutContextType = {
  readonly sets: readonly ExerciseSet[],
  readonly exercises: readonly Exercise[],
  readonly addExercise:(workout: Omit<Exercise, 'id'>) => void,
  readonly addSet: (set: Omit<ExerciseSet, 'id' | 'createdAt'>
  ) => void }

const WorkoutContext = React.createContext<WorkoutContextType>({
  exercises: [],
  sets: [],
  addExercise: () => {},
  addSet: () => {},
});

const originalExercises: readonly Exercise[] = [{
  id: 'press_bench',
  workoutExerciseType: WorkoutExerciseType.PRESS_BENCH,
  name: 'Bench Press',
  associatedCodes: {},
}, {
  id: 'deadlift',
  workoutExerciseType: WorkoutExerciseType.DEADLIFT,
  name: 'Deadlift',
  associatedCodes: {},
}, {
  id: 'romanian_deadlift',
  workoutExerciseType: WorkoutExerciseType.DEADLIFT_RDL,
  name: 'Romanian Deadlift',
  associatedCodes: {},
}, {
  id: 'curl_bicep',
  workoutExerciseType: WorkoutExerciseType.CURL_BICEP,
  name: 'Bicep Curl',
  associatedCodes: {},
}, {
  id: 'triceps_extension',
  workoutExerciseType: WorkoutExerciseType.TRICEPS_EXTENSION,
  name: 'Triceps Extension',
  associatedCodes: {},
}, {
  id: 'shrug',
  workoutExerciseType: WorkoutExerciseType.SHRUG,
  name: 'Shrug',
  associatedCodes: {},
}, {
  id: 'press_sholder',
  workoutExerciseType: WorkoutExerciseType.PRESS_SHOULDER,
  name: 'Shoulder Press',
  associatedCodes: {},
}, {
  id: 'press_shoulder',
  workoutExerciseType: WorkoutExerciseType.PRESS_SHOULDER,
  name: 'Shoulder Press',
  associatedCodes: {},
}, {
  id: 'pull_up',
  workoutExerciseType: WorkoutExerciseType.PULLUP,
  name: 'Pullup',
  associatedCodes: {},
}, {
  id: 'chinup',
  workoutExerciseType: WorkoutExerciseType.CHINUP,
  name: 'Chinup',
  associatedCodes: {},
}, {
  id: 'calf_press',
  workoutExerciseType: WorkoutExerciseType.CALF_PRESS,
  name: 'Calf Press',
  associatedCodes: {},
}, {
  id: 'leg_press',
  workoutExerciseType: WorkoutExerciseType.LEG_PRESS,
  name: 'Leg Press',
  associatedCodes: {},
}];

export const WorkoutContextProvider: React.FC = ({ children }) => {
  const [exercises, setWorkouts] = React.useState<readonly Exercise[]>(originalExercises);
  const [sets, setSets] = React.useState<readonly ExerciseSet[]>([]);

  useEffect(() => {
    void AsyncStorage.getItem('workouts').then((value) => {
      if (value) {
        setWorkouts(JSON.parse(value));
      }
    });

    void AsyncStorage.getItem('sets').then((value) => {
      if (value) {
        setSets(JSON.parse(value));
      }
    });
  }, []);

  useEffect(() => {
    void AsyncStorage.setItem('sets', JSON.stringify(sets));
  }, [sets]);

  useEffect(() => {
    void AsyncStorage.setItem('workouts', JSON.stringify(exercises));
  }, [exercises]);

  const addExercise = useCallback((workout: Omit<Exercise, 'id'>) => {
    setWorkouts((prev) => [{ id: nanoid(), ...workout }, ...prev]);
  }, []);

  const addSet = useCallback((set: Omit<ExerciseSet, 'id' | 'createdAt'>) => {
    setSets((prev) => [{ id: nanoid(), createdAt: Date.now(), ...set }, ...prev]);
  }, []);

  const value = useMemo(() => ({
    sets, exercises, addExercise, addSet,
  }), [addSet, addExercise, sets, exercises]);

  return (
    <WorkoutContext.Provider value={value}>
      { children }
    </WorkoutContext.Provider>
  );
};

export const useExercises = () => React.useContext(WorkoutContext).exercises;

export const useSetsForWorkout = (workoutId: string) => {
  const { sets } = React.useContext(WorkoutContext);

  const setsForWorkout = useMemo(() => sets.filter((s) => s.workoutId === workoutId), [sets, workoutId]);

  return setsForWorkout;
};

export const useAddExercise = () => React.useContext(WorkoutContext).addExercise;

export const useSaveSet = () => React.useContext(WorkoutContext).addSet;

export default WorkoutContext;
