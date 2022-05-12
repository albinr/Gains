/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import { Text as DefaultText, View as DefaultView } from 'react-native';
import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { VictoryAxis } from 'victory-native';
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from 'react-native-reanimated';

import Colors from '../../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export function useThemeColor(
  props: { readonly light?: string; readonly dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[theme][colorName];
}

type ThemeProps = {
  readonly lightColor?: string;
  readonly darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const {
    style, lightColor, darkColor, ...otherProps
  } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const {
    style, lightColor, darkColor, ...otherProps
  } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: ViewProps) {
  const {
    style, lightColor, darkColor, ...otherProps
  } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
}) => {
  // #region styles
  // const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#000000' }, 'background');
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor,
  }));
  const containerStyle = React.useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  );
  // #endregion

  // render
  return <Animated.View pointerEvents='none' style={containerStyle} />;
};

// export default CustomBackground;
// export const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
//   style, animatedIndex,
// }) => {
//   // #region styles
//   // const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
//   const backgroundColorTheme = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
//   const containerAnimatedStyle = useAnimatedStyle(() => ({
//     backgroundColor: interpolateColor(
//       animatedIndex.value,
//       [0, 1],
//       [backgroundColorTheme, backgroundColorTheme],
//     ),
//   }));
//   const containerStyle = React.useMemo(
//     () => [style, containerAnimatedStyle],
//     [style, containerAnimatedStyle],
//   );
