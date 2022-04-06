import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button, Dialog, List, Portal,
  Searchbar, Text, TextInput, useTheme,
} from 'react-native-paper';

import useBoolState from '../hooks/useBoolState';
import { RootTabScreenProps } from '../../types';
import { AuthContext } from '../contexts/AuthContext';
import { useWorkouts } from '../contexts/WorkoutDataContext';

export default function WorkoutListScreen({ navigation }: RootTabScreenProps<'WorkoutListTab'>) {
  const workouts = useWorkouts();
  const { logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');

  const workoutsToShow = useMemo(() => (searchQuery.length > 0
    ? workouts.filter((w) => w.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))
    : workouts), [searchQuery, workouts]);

  useEffect(() => {
    navigation.setOptions({

    });
  }, []);
}
