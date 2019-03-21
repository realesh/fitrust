import React from 'react';
import {View, StyleSheet, GestureResponderEvent} from 'react-native';
import {Text, Button} from '../../../generals/core-ui';
import {GREEN, RED, GREY} from '../../../generals/constants/colors';
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

export default function BMIInsight(props: Props) {
  let {onPress} = props;
  return (
    <View style={styles.boxShadow}>
      <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
        32.2{' '}
        <Text fontWeight="bold" style={{color: RED}}>
          Obese
        </Text>
      </Text>
      <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY, marginBottom: 15}}>
        Your Current BMI
      </Text>

      <View style={styles.bmiBarContainer}>
        <View style={styles.underBar} />
        <View style={styles.normalBar} />
        <View style={styles.overBar} />
        <View style={styles.obeseBar} />
      </View>
      <View style={{flexDirection: 'row', width: '100%'}}>
        <View style={styles.underContainer}>
          <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY}}>
            15
          </Text>
        </View>
        <View style={styles.normalContainer}>
          <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY}}>
            18.5
          </Text>
        </View>
        <View style={styles.overContainer}>
          <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY}}>
            25
          </Text>
        </View>
        <View style={styles.obeseContainer}>
          <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY}}>
            30
          </Text>
          <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY}}>
            40
          </Text>
        </View>
      </View>

      <Button
        iconName="more-horizontal"
        style={styles.optionsButton}
        fontColor={GREY}
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
  bmiBarContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 4,
    marginBottom: 3,
  },
  underBar: {
    flex: 3.5,
    backgroundColor: '#4DD2D3',
    borderRadius: 2,
    marginRight: 5,
  },
  normalBar: {
    flex: 6.5,
    backgroundColor: GREEN,
    borderRadius: 2,
    marginRight: 5,
  },
  overBar: {
    flex: 5,
    backgroundColor: '#EFD422',
    borderRadius: 2,
    marginRight: 5,
  },
  obeseBar: {
    flex: 10,
    backgroundColor: RED,
    borderRadius: 4,
  },
  underContainer: {
    flex: 3.5,
    marginRight: 5,
  },
  normalContainer: {
    flex: 6.5,
    marginRight: 5,
  },
  overContainer: {
    flex: 5,
    marginRight: 5,
  },
  obeseContainer: {
    flex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
