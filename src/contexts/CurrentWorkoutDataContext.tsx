import React, { useCallback, useEffect, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import {
  Workout,
} from '../../types';
import { GainsContext, GainsContextType } from './GainsDataContext';
import { ExerciseDefaultFragment } from '../clients/healthcloud.generated';
// void AsyncStorage.clear();

type ExerciseWithStatus = ExerciseDefaultFragment & { readonly isCompleted: boolean };

  type CurrentWorkoutContextType = {
    readonly startWorkout:(workoutTemplateId?: string) => Workout,
    readonly finishWorkout:() => Workout | null,
    readonly addExerciseToWorkout:(exerciseId: string) => void,
    readonly nextExercise:() => void,
    readonly selectExercise: (exerciseId: string) => void,
    readonly isExerciseCompleted: (exerciseId: string) => boolean,
    // getCompletedExercisesFromWorkout:(exercisesWithStatus:{}) => Workout | null,
    readonly activeWorkout: Workout | null,
    readonly currentExercise: ExerciseDefaultFragment | null,
    readonly hasActiveWorkout: boolean,
    readonly startTimer: () => void,
    readonly pauseTimer: () => void
    readonly removeExercise: (exerciseId: string) => void,

    getCompletedSetCountForExercise(exerciseId: string): number,
    readonly exercisesInActiveWorkout: readonly ExerciseWithStatus[],
    readonly nonCompletedExercisesInActiveWorkout: readonly ExerciseWithStatus[],
    readonly completedExercisesInActiveWorkout: readonly ExerciseWithStatus[],
    // readonly nextWorkout: () => void
  }

const CurrentWorkoutContext = React.createContext<CurrentWorkoutContextType>({
  removeExercise: () => {},
  addExerciseToWorkout: () => {},
  activeWorkout: null,
  nextExercise: () => {},
  selectExercise: () => {},
  isExerciseCompleted: () => false,
  // getCompletedExercisesFromWorkout: () => ({} as Workout),
  // setsForWorkout: () => {},
  startTimer: () => {},
  pauseTimer: () => {},
  finishWorkout: () => ({} as Workout),
  hasActiveWorkout: false,
  startWorkout: () => ({} as Workout),
  currentExercise: null,
  getCompletedSetCountForExercise: () => 0,
  exercisesInActiveWorkout: [],
  completedExercisesInActiveWorkout: [],
  nonCompletedExercisesInActiveWorkout: [],
  // nextWorkout: () => {},
});

export const CurrentWorkoutContextProvider: React.FC = ({ children }) => {
  const {
    workoutTemplates, addWorkout, sets, exercises, getTotalSetCountForExercise,
  } = React.useContext<GainsContextType>(GainsContext);
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeWorkout, setActiveWorkout] = React.useState<Workout | null>(null);
  // const [selected, setSelected] = React.useState(1); // remove this later

  const startWorkout = useCallback((workoutTemplateId?: string) => {
    /* if (activeWorkout) {
      return activeWorkout;
    } */
    const exerciseIds = workoutTemplates.find((t) => t.id === workoutTemplateId)?.exerciseIds || [];
    const newWorkout: Workout = {
      id: nanoid(),
      timers: [],
      // templateId: workoutTemplateId,
      exercisesWithStatus: exerciseIds.map((exerciseId) => ({ exerciseId, isCompleted: false })),
    };
    setActiveWorkout(newWorkout);
    console.log('new workout', newWorkout);
    return newWorkout;
  }, [workoutTemplates]);

  const finishWorkout = useCallback(() => {
    if (!activeWorkout) {
      return null;
    }

    const finishedWorkout = { ...activeWorkout, endTime: new Date() };

    // setActiveWorkout(null);
    addWorkout(finishedWorkout);

    // spara workout mot backend (utöver det som görs)

    return finishedWorkout;
  }, [activeWorkout, addWorkout]);

  const removeExercise = useCallback((exerciseId: string) => {
    if (!activeWorkout) {
      return;
    }
    const exercisesWithStatus = activeWorkout.exercisesWithStatus.filter((e) => e.exerciseId !== exerciseId);
    setActiveWorkout({ ...activeWorkout, exercisesWithStatus });
  }, [activeWorkout]);

  const exercisesInActiveWorkout = useMemo(
    () => {
      if (!activeWorkout) {
        return [];
      }
      return activeWorkout.exercisesWithStatus.map((e) => {
        const exercise = exercises.find((ex) => ex._id === e.exerciseId)!;

        return { ...exercise, isCompleted: e.isCompleted };
      });
    },
    [activeWorkout, exercises],
  );

  const nonCompletedExercisesInActiveWorkout = useMemo(() => exercisesInActiveWorkout.filter((e) => !e.isCompleted), [exercisesInActiveWorkout]);

  const completedExercisesInActiveWorkout = useMemo(() => exercisesInActiveWorkout.filter((e) => e.isCompleted), [exercisesInActiveWorkout]);

  const getCompletedSetCountForExercise = useCallback((exerciseId: string) => {
    if (!activeWorkout) {
      return 0;
    }
    const completedSetCount = sets.filter((set) => set.exerciseId === exerciseId && set.workoutId === activeWorkout?.id).length;
    return completedSetCount;
  }, [activeWorkout, sets]);

  const isExerciseCompleted = useCallback((exerciseId: string) => {
    const completedSetCount = getCompletedSetCountForExercise(exerciseId);
    const totalSetCount = getTotalSetCountForExercise(exerciseId);
    return completedSetCount >= totalSetCount;
  }, [getCompletedSetCountForExercise, getTotalSetCountForExercise]);

  // --------------------------------------remove this later--------------------------------------------------------------------------------
  /* const nextExerciseWithStatus = useCallback(() => {
    const exerciceNext = activeWorkout?.exercisesWithStatus?.find((exercise) => exercise.exerciseId)?.exerciseId;
    setSelected((prev) => {
      if (prev === exercisesInActiveWorkout.length - 1) {
        return 0;
      }
      return prev + 1;
    });
    const nextExerciseIndex = exercisesInActiveWorkout[selected];
    // return navigation.setParams({ exercise: exercisesInActiveWorkout[selected] });
  }, [activeWorkout, exercisesInActiveWorkout, selected]); */

  const selectExercise = useCallback((exerciseId: string) => {
    if (!activeWorkout) {
      return;
    }

    const exerciceIndex = activeWorkout.exercisesWithStatus.findIndex((t) => t.exerciseId === exerciseId);

    if (exerciceIndex > -1) {
      const exercise = activeWorkout.exercisesWithStatus[exerciceIndex]!;
      setActiveWorkout((prev) => ({
        ...prev!,
        exercisesWithStatus: [exercise, ...prev!.exercisesWithStatus.slice(0, exerciceIndex), ...prev!.exercisesWithStatus.slice(exerciceIndex + 1)],
      }));
    }
  }, [activeWorkout]);

  const nextExercise = useCallback(() => {
    if (!activeWorkout) {
      return;
    }

    const exerciseId = nonCompletedExercisesInActiveWorkout[0]?._id;

    if (!exerciseId) {
      return;
    }

    // is this exercise completed? if completed return with isCompleted: true
    const isCompleted = isExerciseCompleted(exerciseId);
    if (isCompleted) {
      setActiveWorkout((prev) => ({
        ...prev!,
        exercisesWithStatus: prev!.exercisesWithStatus.map((s) => (s.exerciseId === exerciseId ? { ...s, isCompleted: true } : s)),
      }));
      return;
    }
    const exerciceIndex = activeWorkout.exercisesWithStatus.findIndex((t) => t.exerciseId === exerciseId);

    if (exerciceIndex > -1) {
      const exercise = activeWorkout.exercisesWithStatus[exerciceIndex]!;
      setActiveWorkout((prev) => ({
        ...prev!,
        exercisesWithStatus: [...prev!.exercisesWithStatus.slice(0, exerciceIndex), ...prev!.exercisesWithStatus.slice(exerciceIndex + 1), exercise],
      }));
    }

    // 1. Change navigation to next workout (useNavigation)
    // 2. Set current exercise to completed

    // set
    // a (current), b, c, d -> b (current), c, d

    // BONUS: switch exercice (if less than exercise set count)
    // a (current), b, c, d -> b (current), a, c, d
  }, [activeWorkout, nonCompletedExercisesInActiveWorkout, isExerciseCompleted]);

  const addExerciseToWorkout = useCallback((exerciseId: string) => {
    if (activeWorkout) {
      setActiveWorkout((prev) => ({
        ...prev!,
        exercisesWithStatus: [...prev!.exercisesWithStatus, { completedSetCount: 0, exerciseId, isCompleted: false }],
      }));
    }
  }, [activeWorkout]);

  const startTimer = useCallback(() => {
    if (activeWorkout) {
      const currentTimer = activeWorkout.timers.find((t) => !t.endTime);
      if (!currentTimer) {
        // eslint-disable-next-line
        setActiveWorkout(prev => ({ 
          ...prev!,
          timers: [...prev!.timers, { startTime: new Date() }],
        }));
      }
    }
  }, [activeWorkout]);
  const pauseTimer = useCallback(() => {
    if (activeWorkout) {
      const currentTimer = activeWorkout.timers.find((t) => !t.endTime);
      if (currentTimer) {
        setActiveWorkout((prev) => ({
          ...prev!,
          timers: prev!.timers.map((t) => (t === currentTimer ? { ...t, endTime: new Date() } : t)),
        }));
      }
    }
  }, [activeWorkout]);

  const value = useMemo<CurrentWorkoutContextType>(() => ({
    activeWorkout,
    startWorkout,
    finishWorkout,
    removeExercise,
    completedExercisesInActiveWorkout,
    nonCompletedExercisesInActiveWorkout,
    selectExercise,
    nextExercise,
    exercisesInActiveWorkout,
    getCompletedSetCountForExercise,
    currentExercise: nonCompletedExercisesInActiveWorkout[0] || null,
    isExerciseCompleted,
    // setsForWorkout,
    addExerciseToWorkout,
    startTimer,
    pauseTimer,
    hasActiveWorkout: !!activeWorkout,
  }), [activeWorkout, startWorkout, finishWorkout, removeExercise, completedExercisesInActiveWorkout, nonCompletedExercisesInActiveWorkout,
    selectExercise, nextExercise, exercisesInActiveWorkout, getCompletedSetCountForExercise, addExerciseToWorkout, startTimer, pauseTimer, isExerciseCompleted]);

  return (
    <CurrentWorkoutContext.Provider value={value}>
      { children }
    </CurrentWorkoutContext.Provider>
  );
};

export const useNextExercise = () => React.useContext(CurrentWorkoutContext).nextExercise;

export const useGetCompletedSetCountForExercise = () => React.useContext(CurrentWorkoutContext).getCompletedSetCountForExercise;

export const useRemoveExercise = () => React.useContext(CurrentWorkoutContext).removeExercise;

export const useStartWorkout = () => {
  const { startWorkout } = React.useContext(CurrentWorkoutContext);
  return startWorkout;
};

export const useAddExerciseToWorkout = () => {
  const { addExerciseToWorkout } = React.useContext(CurrentWorkoutContext);
  return addExerciseToWorkout;
};

export const useStartTimer = () => {
  const { startTimer } = React.useContext(CurrentWorkoutContext);
  return startTimer;
};

export const usePauseTimer = () => {
  const { pauseTimer } = React.useContext(CurrentWorkoutContext);
  return pauseTimer;
};

export const useCurrentWorkoutTime = () => {
  const [currentTime, setCurrentTime] = React.useState<string | null>(null),
        { activeWorkout } = React.useContext(CurrentWorkoutContext);

  useEffect(() => {
    if (activeWorkout) {
      const accumulatedTime = activeWorkout.timers.reduce((acc, timer) => {
        if (timer.endTime) {
          return acc + timer.endTime.valueOf() - timer.startTime.valueOf();
        }
        return acc;
      }, 0);
      // const date = new Date(0);
      // date.setSeconds(45); // specify value for SECONDS here
      // const timeString = date.toISOString();

      const updateTime = (startTime: number) => {
        const timeInMs = accumulatedTime + Date.now() - startTime,
              seconds = Math.floor(timeInMs / 1000),
              minutes = Math.floor(seconds / 60),
              hours = Math.floor(minutes / 60),
              // time = `${hours}${minutes % 60}${seconds % 60}`;
              time = [hours, minutes % 60, seconds % 60];
        const timeShown = time.map((t) => (t < 10 ? `0${t}` : t)).join(':');

        const shouldShowHours = hours > 0;
        setCurrentTime(shouldShowHours ? `${timeShown}` : `${timeShown.slice(3)}`);
        // setCurrentTime(timeShown);
      };

      const activeTimer = activeWorkout.timers.find((t) => !t.endTime);
      if (activeTimer) {
        const startTime = activeTimer.startTime.valueOf();
        updateTime(startTime);
        const cancelInterval = setInterval(() => {
          updateTime(startTime);
        }, 1000);
        return () => clearInterval(cancelInterval);
      }
    }
    return () => {};
  }, [activeWorkout]);
  return currentTime;
};

export default CurrentWorkoutContext;
