import React from 'react';
import {View, StyleSheet, GestureResponderEvent} from 'react-native';
import {Text, Button} from '../../../generals/core-ui';
import {WHITE, BLUE} from '../../../generals/constants/colors';
import {
  LARGE_FONT_SIZE,
  SMALL_FONT_SIZE,
} from '../../../generals/constants/size';

type Props = {
  /**
   * Function to invoke when button pressed.
   */
  onPress: (event: GestureResponderEvent) => void;
};

export default function MissionInsight(props: Props) {
  let {onPress} = props;
  return (
    <View style={[styles.boxShadow, styles.missionContainer]}>
      <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE} style={{color: WHITE}}>
        0
        <Text fontWeight="bold" style={{color: 'rgba(255,255,255,0.5)'}}>
          {' '}
          %
        </Text>
      </Text>

      <Text fontSize={SMALL_FONT_SIZE} style={{color: 'rgba(255,255,255,0.5)'}}>
        Mission
      </Text>

      <Button
        iconName="more-horizontal"
        style={styles.optionsButton}
        fontColor={'rgba(255,255,255,0.5)'}
        fontSize={LARGE_FONT_SIZE}
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  boxShadow: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
  },
  missionContainer: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: BLUE,
  },
  optionsButton: {
    position: 'absolute',
    alignItems: 'center',
    right: 15,
    top: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
});
