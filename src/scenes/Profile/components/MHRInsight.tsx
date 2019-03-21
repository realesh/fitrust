import React from 'react';
import {View, StyleSheet, GestureResponderEvent, Image} from 'react-native';
import {Text, Button} from '../../../generals/core-ui';
import {RED, WHITE} from '../../../generals/constants/colors';
import {
  LARGE_FONT_SIZE,
  SMALL_FONT_SIZE,
} from '../../../generals/constants/size';
import {heartRate} from '../../../assets/images/profile';

type Props = {
  /**
   * Function to invoke when button pressed.
   */
  onPress: (event: GestureResponderEvent) => void;
};

export default function MHRInsight(props: Props) {
  let {onPress} = props;
  return (
    <View style={[styles.boxShadow, styles.mhrContainer]}>
      <Image
        source={heartRate}
        style={{width: 30, height: 30, marginRight: 5}}
      />
      <View style={styles.flexColumn}>
        <Text
          fontWeight="bold"
          fontSize={LARGE_FONT_SIZE}
          style={{color: WHITE}}
        >
          198{' '}
          <Text fontWeight="bold" style={{color: 'rgba(255,255,255,0.5)'}}>
            BPM
          </Text>
        </Text>

        <Text
          fontSize={SMALL_FONT_SIZE}
          style={{color: 'rgba(255,255,255,0.5)'}}
        >
          Current MHR
        </Text>
      </View>

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
  flexColumn: {flexDirection: 'column'},
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
  mhrContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: RED,
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
