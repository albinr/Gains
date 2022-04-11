import React, { useCallback, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';

import { ExerciseSet, Workout } from '../../types';
import { WorkoutExerciseType } from '../../clients/__generated__/schema';

const WorkoutContext = React.createContext<{ 
  readonly sets: readonly ExerciseSet[], 
  readonly workouts: readonly Workout[], readonly addWorkout:(workout: Omit<Workout, 'id'>) => void, readonly addSet: (set: Omit<ExerciseSet, 'id' | 'createdAt'>
) => void }>({
  workouts: [],
  sets: [],
  addWorkout: () => {},
  addSet: () => {},
});

const originalWorkouts: readonly Workout[] = [{
  id: 'press_bench',
  workoutExerciseType: WorkoutExerciseType.PRESS_BENCH,
  name: 'Bench Press',
  associatedCodes: {}
}];

export const WorkoutContextProvider: React.FC = ({ children }) => {
  const [workouts, setWorkouts] = React.useState<readonly Workout[]>(originalWorkouts);
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
    void AsyncStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = useCallback((workout: Omit<Workout, 'id'>) => {
    setWorkouts((prev) => [{ id: nanoid(), ...workout }, ...prev]);
  }, []);

  const addSet = useCallback((set: Omit<ExerciseSet, 'id' | 'createdAt'>) => {
    setSets((prev) => [{ id: nanoid(), createdAt: Date.now(), ...set }, ...prev]);
  }, []);

  return (
    <WorkoutContext.Provider value={{
      sets, workouts, addWorkout, addSet,
    }}
    >
      { children }
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => React.useContext(WorkoutContext).workouts;

export const useSetsForWorkout = (workoutId: string) => {
  const { sets } = React.useContext(WorkoutContext);

  const setsForWorkout = useMemo(() => sets.filter((s) => s.workoutId === workoutId), [sets, workoutId]);

  return setsForWorkout;
};

export const useAddWorkout = () => React.useContext(WorkoutContext).addWorkout;

export const useSaveSet = () => React.useContext(WorkoutContext).addSet;

export default WorkoutContext;
