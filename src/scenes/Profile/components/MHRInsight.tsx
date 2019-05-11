import React from 'react';
import {View, StyleSheet, GestureResponderEvent, Image} from 'react-native';
import {Text, Button} from '../../../generals/core-ui';
import {RED, WHITE} from '../../../generals/constants/colors';
import {
  LARGE_FONT_SIZE,
  TINY_FONT_SIZE,
} from '../../../generals/constants/size';
import {heartRate} from '../../../assets/images/profile';

type Props = {
  /**
   * Function to invoke when button pressed.
   */
  onPress: (event: GestureResponderEvent) => void;
  dob: string;
};

export default function MHRInsight(props: Props) {
  let {onPress, dob} = props;

  let now = new Date().getFullYear();
  let dobYear = new Date(dob).getFullYear();
  let age = now - dobYear;

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
          {`${220 - age} `}
          <Text fontWeight="bold" style={{color: 'rgba(255,255,255,0.5)'}}>
            BPM
          </Text>
        </Text>

        <Text
          fontSize={TINY_FONT_SIZE}
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
    padding: 20,
    shadowColor: '#ccc',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
  },
  mhrContainer: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: RED,
  },
  optionsButton: {
    position: 'absolute',
    alignItems: 'center',
    right: 20,
    top: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
});
