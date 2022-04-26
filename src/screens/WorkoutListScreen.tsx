import { View } from 'react-native';

import { styles } from '../../constants/Styles';
import { RootTabScreenProps } from '../../types';

export default function WorkoutListScreen({ navigation }: RootTabScreenProps<'WorkoutListTab'>) {
  return (
    <View style={styles.wrapper} />
  );
}
