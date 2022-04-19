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
    console.log('starting workout', timer);
  }, [onStart, timer, startingExercise]);

  return (
    <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
      {/* {timer ? ( */}
      <IconButton icon='play' style={{ backgroundColor: 'lightgreen' }} size={50} onPress={onStartWorkout} />
      {/*  ) : (null)} */}
    </View>
  );
};
