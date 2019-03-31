import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';

import {LIGHT_GREY} from '../constants/colors';

type Props = ViewProps & {
  color?: string;
  direction?: 'horizontal' | 'vertical';
};

function Separator({
  direction = 'horizontal',
  color = LIGHT_GREY,
  style,
}: Props) {
  return (
    <View
      style={[
        styles.root,
        {backgroundColor: color},
        direction === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
    />
  );
}

let styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  horizontal: {
    height: 1,
    maxHeight: 1,
    minHeight: 1,
  },
  vertical: {
    width: 1,
    maxWidth: 1,
    minWidth: 1,
  },
});

export default Separator;
