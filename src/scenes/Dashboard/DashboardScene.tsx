import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '../../generals/core-ui';
import {MEDIUM_FONT_SIZE, LARGE_FONT_SIZE} from '../../generals/constants/size';
import {BLUE} from '../../generals/constants/colors';

export default function DashboardScene() {
  return (
    <View style={styles.root}>
      <View style={styles.paddedContainer}>
        <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
          Hello, Sandro.
        </Text>
        <Text
          fontWeight="light"
          fontSize={MEDIUM_FONT_SIZE}
          style={{marginTop: 5}}
        >
          You've burned{' '}
          <Text
            fontWeight="light"
            fontSize={MEDIUM_FONT_SIZE}
            style={{color: BLUE}}
          >
            504 cals
          </Text>{' '}
          today
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  paddedContainer: {
    paddingHorizontal: 20,
  },
  image: {marginBottom: 10, width: 180, height: 48},
});
