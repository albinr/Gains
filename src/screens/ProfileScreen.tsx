import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button, useTheme,
} from 'react-native-paper';

import { View } from '../components/Themed';
import { RootTabScreenProps } from '../../types';
import useBoolState from '../hooks/useBoolState';
import { useAddExercise, useExercises } from '../contexts/WorkoutDataContext';
import { AuthContext } from '../contexts/AuthContext';
import ExerciseModal from '../components/modals/DragableExersiceModal';

export default function ProflieScreen({ navigation }: RootTabScreenProps<'ProfileTab'>) {
  const { logout } = useContext(AuthContext);
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Button onPress={logout}>Log out</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
