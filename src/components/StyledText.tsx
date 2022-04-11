import * as React from 'react';

import { Text, TextProps } from './Themed';

export function MonoText({ style, ...props }: TextProps) {
  return <Text {...props} style={[style, { fontFamily: 'space-mono' }]} />;
}
