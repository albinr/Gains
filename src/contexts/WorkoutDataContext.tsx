import React, { useCallback, useEffect, useMemo } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Set, Workout } from "../../types";
import { nanoid } from "nanoid";


const WorkoutContext = React.createContext<{ sets: Set[], workouts: Workout[], addWorkout: (workout: Omit<Workout, 'id'>) => void,  addSet: (set: Omit<Set, 'id' | 'createdAt'>) => void }>({
    workouts: [],
    sets: [],
    addWorkout: () => {},
    addSet: () => {},
  });

export const WorkoutContextProvider: React.FC = ({ children }) => {
    const [workouts, setWorkouts] = React.useState<Workout[]>([]);
    const [sets, setSets] = React.useState<Set[]>([]);
  
    useEffect(() => {
      AsyncStorage.getItem('workouts').then((value) => {
        if(value){
          setWorkouts(JSON.parse(value))
        }
      });
  
      AsyncStorage.getItem('sets').then((value) => {
        if(value){
          setSets(JSON.parse(value))
        }
      });
    }, [])
  
    useEffect(() => {
      AsyncStorage.setItem('sets', JSON.stringify(sets));
    }, [sets])
  
    useEffect(() => {
      AsyncStorage.setItem('workouts', JSON.stringify(workouts));
    }, [workouts])

    const addWorkout = useCallback((workout: Omit<Workout, 'id'>) => {
      setWorkouts(prev => [{ id: nanoid(), ...workout }, ...prev])
    }, []);

    const addSet = useCallback((set: Omit<Set, 'id' | 'createdAt'>) => {
      setSets(prev => [{ id: nanoid(), createdAt: Date.now(), ...set }, ...prev])
  }, []);
  
    return <WorkoutContext.Provider value={{ sets, workouts, addWorkout, addSet }}>
      { children }
    </WorkoutContext.Provider>
  }

  export const useWorkouts = () => React.useContext(WorkoutContext).workouts;

  export const useSetsForWorkout = (workoutId: string) => {

    const { sets } = React.useContext(WorkoutContext);

    const setsForWorkout = useMemo(() => sets.filter(s => s.workoutId === workoutId), [sets, workoutId]);

    return setsForWorkout;
  }

  export const useAddWorkout = () => React.useContext(WorkoutContext).addWorkout;

  export const useSaveSet = () => React.useContext(WorkoutContext).addSet;

  export default WorkoutContext;