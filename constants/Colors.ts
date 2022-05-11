const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const primary = '#473177';
const secondary = '#424242';
const accent = '#662C69';
const onPrimary = '#ffffff';
// const primaryOpacity = `${primaryDark}80`;

export default {
  light: {
    text: '#000',
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

export {
  primary, secondary, tintColorLight, tintColorDark,
};
