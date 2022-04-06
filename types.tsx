/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: {
    workout: Workout
  };
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  WorkoutListTab: undefined;
  ExerciseListTab: undefined;
  StartWorkoutTab: undefined;
  TabTwo: undefined;
  ProfileTab: undefined;

};

export type LoginParamList = {
  readonly LoginRequest: undefined;
  readonly LoginConfirm: { readonly email: string };
};

export type LoginScreenProps<Screen extends keyof LoginParamList> = CompositeScreenProps<
NativeStackScreenProps<LoginParamList, Screen>,
NativeStackScreenProps<RootStackParamList>
>;


export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;


export type Workout = {
  id: string;
  name: string;
  associatedCodes: Record<string, string>
}

export type Set = {
  id: string;
  reps: number;
  weight: number;
  createdAt: number;
  workoutId: string;
}


