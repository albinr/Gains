const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const primary = '#BADF5E';
const secondary = '#000000';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

export { primary, secondary, tintColorLight, tintColorDark };