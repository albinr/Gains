import React, { useCallback, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';

import {
  ExerciseSet, Workout, WorkoutTemplate,
} from '../../types';
import { useExercisesQuery, ExerciseDefaultFragment } from '../clients/healthcloud.generated';

// void AsyncStorage.clear();

export type GainsContextType = {
  readonly workouts: readonly Workout[],
  readonly workoutTemplates: readonly WorkoutTemplate[],
  readonly sets: readonly ExerciseSet[],
  // readonly exercises: readonly Exercise[],
  readonly exercises: readonly ExerciseDefaultFragment[],
  // readonly checkifActiveWorkoutAlreadyExists: (workout: Workout) => boolean,
  // getExercisesById(exerciseIds: string[]): readonly Exercise[],
  // getExerciseAutosuggestions(): readonly Exercise[],
  searchForExercises(query: string): readonly ExerciseDefaultFragment[],
  readonly addWorkout: (workout: Workout) => void,
  readonly removeWorkout: (workoutId: string) => void,
  readonly upsertWorkoutTemplate:(exercises: readonly string[], name: string, favourite: boolean, createdAt: Date, workoutTemplateId?: string) => void,
  readonly addExercise:(exercise: Omit<ExerciseDefaultFragment, 'id'>) => void,
  readonly addSet: (set: Omit<ExerciseSet, 'id' | 'createdAt'>) => void,
  getTotalSetCountForExercise(exerciseId: string): number,
}

export const GainsContext = React.createContext<GainsContextType>({
  workouts: [],
  exercises: [],
  workoutTemplates: [],
  sets: [],
  // checkifActiveWorkoutAlreadyExists: () => false,
  searchForExercises: () => [],
  addWorkout: () => {},
  removeWorkout: () => {},
  addExercise: () => {},
  upsertWorkoutTemplate: () => {},
  addSet: () => {},
  getTotalSetCountForExercise: () => 0,
});

const DEFAULT_SET_COUNT = 3;

export const GainsContextProvider: React.FC = ({ children }) => {
  const [workouts, setWorkouts] = React.useState<readonly Workout[]>([]);
  // const [exercises, setExercises] = React.useState<readonly Exercise[]>(originalExercises);
  const [workoutTemplates, setWorkoutTemplates] = React.useState<readonly WorkoutTemplate[]>([]);
  const [sets, setSets] = React.useState<readonly ExerciseSet[]>([]);
  const [{ data }] = useExercisesQuery();
  const exercises = useMemo(() => (data?.me?.__typename === 'User' ? data.me.exercises : []), [data]);
  // const [searchQuery, setSeachQuery] = React.useState<readonly Exercise[]>([]);

  useEffect(() => {
    void AsyncStorage.getItem('workouts').then((value) => {
      if (value) {
        setWorkouts(JSON.parse(value));
      }
    });

    void AsyncStorage.getItem('workoutTemplates').then((value) => {
      if (value) {
        const workoutTemplatesJson = JSON.parse(value) as readonly WorkoutTemplate[];
        setWorkoutTemplates(workoutTemplatesJson.map((workoutTemplate) => ({
          ...workoutTemplate,
          createdAt: new Date(workoutTemplate.createdAt),
        })));
      }
    });

    void AsyncStorage.getItem('sets').then((value) => {
      if (value) {
        setSets(JSON.parse(value));
      }
    });
  }, []);

  const removeWorkout = useCallback((workoutTemplateId) => {
    if (!workoutTemplates) {
      return;
    }
    setWorkoutTemplates((prev) => prev.filter((workoutTemplate) => workoutTemplate.id !== workoutTemplateId));
  }, [workoutTemplates]);

  useEffect(() => {
    void AsyncStorage.setItem('sets', JSON.stringify(sets));
  }, [sets]);

  useEffect(() => {
    void AsyncStorage.setItem('workoutTemplates', JSON.stringify(workoutTemplates));
  }, [workoutTemplates]);

  useEffect(() => {
    void AsyncStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = useCallback((workout: Omit<Workout, 'id'>) => {
    setWorkouts((prev) => [{ id: nanoid(), ...workout }, ...prev]);
  }, []);

  const addExercise = useCallback((exercise: Omit<ExerciseDefaultFragment, 'id'>) => {
    // setExercises((prev) => [{ id: nanoid(), ...exercise }, ...prev]);
  }, []);

  const addSet = useCallback((set: Omit<ExerciseSet, 'id' | 'createdAt'>) => {
    setSets((prev) => [{ id: nanoid(), createdAt: Date.now(), ...set }, ...prev]);

    // spara set mot backend (utöver det som görs)
  }, []);

  const getTotalSetCountForExercise = useCallback(
    (exerciseId: string) => DEFAULT_SET_COUNT,
    /* const exercise = exercises.find((e) => e.id === exerciseId);
      if (exercise && exercise.setCount) {
        return exercise.setCount;
      } */
    [],
  );
  // const checkIfWorkoutExists = useCallback((workoutId: string) => workouts.some((workout) => workout.id === workoutId), [workouts]);
  // const checkIfWorkoutTemplateExists = useCallback((workoutTemplateId: string) => workoutTemplates.some((workoutTemplate) => workoutTemplate.id === workoutTemplateId), [workoutTemplates]);

  const checkIfActiveWorkoutAlreadyExists = useCallback(() => {
    const activeWorkout = workouts.find((workout) => workout);
    if (activeWorkout) {
      return workoutTemplates.some((workoutTemplate) => workoutTemplate.id === activeWorkout.id);
    }
    return false;
  }, [workouts, workoutTemplates]);
  /* const checkIfWorkoutTemplateIdExists = useCallback((workoutTemplateId: string) => {
    const workoutIsSaved = workoutTemplates.some((workoutTemplate) => workoutTemplate.id === workoutTemplateId);
    return workoutIsSaved;
  }, [workoutTemplates]); */

  const upsertWorkoutTemplate = useCallback<GainsContextType['upsertWorkoutTemplate']>((exercises, name, favourite, createdAt, workoutTemplateId) => {
    setWorkoutTemplates((prev) => {
      const workoutTemplate = prev.find((template) => template.id === workoutTemplateId);
      if (workoutTemplate) {
        return prev.map((template) => (template.id === workoutTemplateId ? {
          ...template, name, exerciseIds: exercises, favourite, createdAt,
        } : template));
      }
      return [...prev, {
        id: workoutTemplateId || nanoid(), exerciseIds: exercises, name, favourite, createdAt,
      }];
    });
  }, []);

  const searchForExercises = useCallback((query) => exercises.filter((exercise) => exercise.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [exercises]);

  const value = useMemo<GainsContextType>(() => ({
    sets,
    exercises,
    workouts,
    addExercise,
    addSet,
    // checkIfActiveWorkoutAlreadyExists,
    addWorkout,
    removeWorkout,
    getTotalSetCountForExercise,
    workoutTemplates,
    searchForExercises,
    upsertWorkoutTemplate,
  }), [addSet, addExercise, sets, exercises, workouts, addWorkout, removeWorkout, workoutTemplates,
    upsertWorkoutTemplate, searchForExercises, getTotalSetCountForExercise]);

  return (
    <GainsContext.Provider value={value}>
      { children }
    </GainsContext.Provider>
  );
};

export const useUpsertWorkoutTemplate = () => {
  const { upsertWorkoutTemplate } = React.useContext(GainsContext);
  return upsertWorkoutTemplate;
};

export const useGetTotalSetCountForExercise = () => React.useContext(GainsContext).getTotalSetCountForExercise;

export const useSearchForExercises = () => {
  // eslint-disable-next-line
  const { searchForExercises } = React.useContext(GainsContext);

  return searchForExercises;
};

export const useWorkoutTemplates = () => {
  const { workoutTemplates } = React.useContext(GainsContext);
  return workoutTemplates;
};

export const useExercises = () => React.useContext(GainsContext).exercises;

export const useSetsForExercise = (exerciseId: string) => {
  const { sets } = React.useContext(GainsContext);

  const setsForWorkout = useMemo(() => sets.filter((s) => s.exerciseId === exerciseId), [sets, exerciseId]);

  return setsForWorkout;
};

export const useWorkouts = () => React.useContext(GainsContext).workouts;

export const useRemoveWorkout = () => React.useContext(GainsContext).removeWorkout;

export const useAddExercise = () => React.useContext(GainsContext).addExercise;

export const useSaveSet = () => React.useContext(GainsContext).addSet;

export default GainsContext;
