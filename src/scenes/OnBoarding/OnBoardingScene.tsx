import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Swiper} from '../../generals/components';
import {SCREEN_WIDTH} from '../../generals/constants/size';
import {Text} from '../../generals/core-ui';

export default function OnBoardingScene() {
  return (
    <View style={styles.root}>
      <Swiper>
        <View style={{width: SCREEN_WIDTH}}>
          <Text>Screen 1</Text>
        </View>
        <View style={{width: SCREEN_WIDTH}}>
          <Text>Screen 2</Text>
        </View>
        <View style={{width: SCREEN_WIDTH}}>
          <Text>Screen 3</Text>
        </View>
      </Swiper>
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
