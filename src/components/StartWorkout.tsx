import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { IconButton } from 'react-native-paper';

import { useStartTimer } from '../contexts/CurrentWorkoutDataContext';

export const StartWorkoutButton: React.FC<{ readonly startingExercise: any, readonly onStart: (item: any) => void }> = ({
  startingExercise, onStart,
}) => {
  const timer = useStartTimer();
  /* const onstartTimer = useEffect(() => {
      if (timer) {
        timer();
      }
    }, [timer]); */
  const onStartWorkout = useCallback(() => {
    if (startingExercise && startingExercise.length > 0) {
      timer();
      onStart(startingExercise[0]);
    }
  }, [onStart, timer, startingExercise]);

  return (
    <View style={{ position: 'absolute', bottom: 15, right: 15 }}>
      {/* {timer ? ( */}
      <IconButton icon='play' style={{ backgroundColor: 'lightgreen' }} size={60} onPress={onStartWorkout} />
      {/*  ) : (null)} */}
    </View>
  );
};
