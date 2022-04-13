/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Button, IconButton } from 'react-native-paper';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import { AuthContext } from '../src/contexts/AuthContext';
import NotLoggedInNavigator from './AuthFlow';
import Colors from '../constants/Colors';
import useColorScheme from '../src/hooks/useColorScheme';
// import ModalScreen from '../src/screens/WorkoutDetails';
import ModalScreen from '../src/screens/ExerciseDetails';
import NotFoundScreen from '../src/screens/NotFoundScreen';
import TabScreen from '../src/screens/TabScreen';
import ProflieScreen from '../src/screens/ProfileScreen';
import WorkoutListScreen from '../src/screens/WorkoutListScreen';
import TabTwoScreen from '../src/screens/TabTwoScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  readonly name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  readonly color: string;
}) {
  return <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName='ExerciseListTab'
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      {/*  <BottomTab.Screen
        name='WorkoutListTab'
        component={TabScreen}
        options={({ navigation }: RootTabScreenProps<'WorkoutListTab'>) => ({
          title: 'Workouts',
          tabBarIcon: ({ color }) => <TabBarIcon name='arm-flex' color={color} />,
          headerRight: () => (
            <Pressable
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name='info-circle'
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      /> */}

      <BottomTab.Screen
        name='ExerciseListTab'
        component={WorkoutListScreen}
        options={({ navigation }: RootTabScreenProps<'ExerciseListTab'>) => ({
          title: 'Your Workout',
          tabBarIcon: ({ color }) => <TabBarIcon name='dumbbell' color={color} />,
          headerRight: () => (
            // <Pressable
            //   style={({ pressed }) => ({
            //     opacity: pressed ? 0.5 : 1,
            //   })}
            // >
            //   <FontAwesome
            //     name='info-circle'
            //     size={25}
            //     color={Colors[colorScheme].text}
            //     style={{ marginRight: 15 }}
            //   />
            // </Pressable>
            <IconButton icon='dumbbell' onPress={() => {}} />
          ),
        })}
      />

      <BottomTab.Screen
        name='ProfileTab'
        component={ProflieScreen}
        options={({ navigation }: RootTabScreenProps<'ProfileTab'>) => ({
          title: 'Utils',
          tabBarIcon: ({ color }) => <TabBarIcon name='cog' color={color} />,
          headerRight: () => (
            <Pressable
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name='cog'
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />

    </BottomTab.Navigator>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Root' component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name='NotFound' component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name='Modal' component={ModalScreen} options={{ gestureEnabled: false, fullScreenGestureEnabled: false }} />
    </Stack.Navigator>
  );
}

export default function Navigation({ colorScheme }: { readonly colorScheme: ColorSchemeName }) {
  const { isLoggedIn } = React.useContext(AuthContext);
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      { isLoggedIn ? <RootNavigator /> : <NotLoggedInNavigator /> }
    </NavigationContainer>
  );
}
