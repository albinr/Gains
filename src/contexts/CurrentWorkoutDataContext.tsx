import React, { useCallback, useEffect, useMemo } from 'react';
import { nanoid } from 'nanoid';

import {
  ExerciseSet, Exercise, Workout, WorkoutTemplate,
} from '../../types';
import { WorkoutExerciseType } from '../../clients/__generated__/schema';
import { GainsContext, GainsContextType } from './GainsDataContext';

// void AsyncStorage.clear();

  type CurrentWorkoutContextType = {
    readonly startWorkout:(workoutTemplateId?: string) => Workout,
    readonly finishWorkout:() => Workout | null,
    readonly addExerciseToWorkout:(exerciseId: string) => void,
    readonly nextExercise:(exerciseId: string) => void,
    // getCompletedExercisesFromWorkout:(exercisesWithStatus:{}) => Workout | null,
    readonly activeWorkout: Workout | null,
    readonly hasActiveWorkout: boolean,
    readonly startTimer: () => void,
    readonly pauseTimer: () => void
    readonly removeExercise: (exerciseId: string) => void,
    getCompletedSetCountForExercise(exerciseId: string): number,
    readonly exercisesInActiveWorkout: readonly Exercise[],
    // readonly nextWorkout: () => void
  }

const CurrentWorkoutContext = React.createContext<CurrentWorkoutContextType>({
  removeExercise: () => {},
  addExerciseToWorkout: () => {},
  activeWorkout: null,
  nextExercise: () => {},
  // getCompletedExercisesFromWorkout: () => ({} as Workout),
  // setsForWorkout: () => {},
  startTimer: () => {},
  pauseTimer: () => {},
  finishWorkout: () => ({} as Workout),
  hasActiveWorkout: false,
  startWorkout: () => ({} as Workout),
  getCompletedSetCountForExercise: () => 0,
  exercisesInActiveWorkout: [],
  // nextWorkout: () => {},
});

export const CurrentWorkoutContextProvider: React.FC = ({ children }) => {
  const {
    workoutTemplates, addWorkout, sets, exercises,
  } = React.useContext<GainsContextType>(GainsContext);

  const [activeWorkout, setActiveWorkout] = React.useState<Workout | null>(null);

  const startWorkout = useCallback((workoutTemplateId?: string) => {
    if (activeWorkout) {
      return activeWorkout;
    }
    const newWorkout = {
      exerciseIds: workoutTemplates.find((t) => t.id === workoutTemplateId)?.exerciseIds || [],
      id: nanoid(),
      timers: [],
      startTime: new Date(),
      exercisesWithStatus: [],
    };
    setActiveWorkout(newWorkout);
    return newWorkout;
  }, [activeWorkout, workoutTemplates]);

  const finishWorkout = useCallback(() => {
    if (!activeWorkout) {
      return null;
    }

    const finishedWorkout = { ...activeWorkout, endTime: new Date() };

    addWorkout(finishedWorkout);

    return finishedWorkout;
  }, [activeWorkout, addWorkout]);

  const removeExercise = useCallback((exerciseId: string) => {
    if (!activeWorkout) {
      return;
    }
    const exercisesWithStatus = activeWorkout.exercisesWithStatus.filter((e) => e.exerciseId !== exerciseId);
    setActiveWorkout({ ...activeWorkout, exercisesWithStatus });
  }, [activeWorkout]);

  const exercisesInActiveWorkout = useMemo(() => {
    const exerciseIds = activeWorkout?.exercisesWithStatus.map((e) => e.exerciseId) || [];
    return exercises.filter((e) => exerciseIds.includes(e.id));
  }, [activeWorkout, exercises]);

  const value = useMemo<CurrentWorkoutContextType>(() => ({
    activeWorkout,
    startWorkout,
    finishWorkout,
    removeExercise,
    // nextExercise,
    nextExercise: (exerciseId: string) => {
      if (!activeWorkout) {
        return;
      }
      const exerciseIds = activeWorkout?.exercisesWithStatus.map((e) => e.exerciseId).length;
      const exercisesWithStatus = activeWorkout.exercisesWithStatus.filter((e) => e.exerciseId === exerciseId);

      const currentexerciseId = activeWorkout.exercisesWithStatus.find((t) => t.exerciseId);
      const exerciceIndex = activeWorkout.exercisesWithStatus.findIndex((t) => t.exerciseId === exerciseId);
      if (currentexerciseId) {
        setActiveWorkout((prev) => ({
          ...prev!,
          exercisesWithStatus: [...prev!.exercisesWithStatus],
          // exercisesWithStatus: [...prev!.exercisesWithStatus.slice(0, exerciceIndex)], // , ...prev!.exercisesWithStatus.slice(exerciceIndex + 1)],
          // exercisesWithStatus: [...prev!.exercisesWithStatus.slice(0, exerciceIndex), ...prev!.exercisesWithStatus.slice(exerciceIndex + 1)],
        }));
      }
      // const nextExerciseId = exercisesInActiveWorkout[0];
      // const isCompleted = activeWorkout?.exercisesWithStatus.some((e) => e.exerciseId === nextExerciseId?.id);
      // const exerciseIds = activeWorkout?.exercisesWithStatus.map((e) => e.exerciseId) || [];

      // 1. Change navigation to next workout (useNavigation)
      // 2. Set current exercise to completed

      // set
      // a (current), b, c, d -> b (current), c, d

    // BONUS: switch exercice (if less than exercise set count)
    // a (current), b, c, d -> b (current), a, c, d
    },
    exercisesInActiveWorkout,
    getCompletedSetCountForExercise: (exerciseId: string) => {
      if (!activeWorkout) {
        return 0;
      }
      const completedSetCount = sets.filter((set) => set.exerciseId === exerciseId && set.workoutId === activeWorkout?.id).length;
      return completedSetCount;
    },
    // setsForWorkout,
    addExerciseToWorkout: (exerciseId: string) => {
      if (activeWorkout) {
        setActiveWorkout((prev) => ({
          ...prev!,
          exercisesWithStatus: [...prev!.exercisesWithStatus, { completedSetCount: 0, exerciseId, isCompleted: false }],
        }));
      }
    },
    startTimer: () => {
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
    },
    pauseTimer: () => {
      if (activeWorkout) {
        const currentTimer = activeWorkout.timers.find((t) => !t.endTime);
        if (currentTimer) {
          setActiveWorkout((prev) => ({
            ...prev!,
            timers: prev!.timers.map((t) => (t === currentTimer ? { ...t, endTime: new Date() } : t)),
          }));
        }
      }
    },
    hasActiveWorkout: !!activeWorkout,
  }), [activeWorkout, startWorkout, finishWorkout, removeExercise, exercisesInActiveWorkout, sets]);

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
  const [currentTime, setCurrentTime] = React.useState<number | null>(null),
        { activeWorkout } = React.useContext(CurrentWorkoutContext);

  useEffect(() => {
    if (activeWorkout) {
      const accumulatedTime = activeWorkout.timers.reduce((acc, timer) => {
        if (timer.endTime) {
          return acc + timer.endTime.valueOf() - timer.startTime.valueOf();
        }
        return acc;
      }, 0);

      const updateTime = (startTime: number) => {
        const timeInMs = accumulatedTime + Date.now() - startTime,
              seconds = Math.floor(timeInMs / 1000);

        setCurrentTime(seconds);
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
