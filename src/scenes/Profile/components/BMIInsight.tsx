import React from 'react';
import {View, StyleSheet, GestureResponderEvent} from 'react-native';
import {Text, Button} from '../../../generals/core-ui';
import {RED, GREY, bmiScaleColor} from '../../../generals/constants/colors';
import {
  LARGE_FONT_SIZE,
  TINY_FONT_SIZE,
} from '../../../generals/constants/size';
import {bmiScaleList} from '../../BMI/data/BMIData';

type Props = {
  /**
   * Function to invoke when button pressed.
   */
  onPress: (event: GestureResponderEvent) => void;
  BMIValue: number;
};

export default function BMIInsight(props: Props) {
  let {onPress, BMIValue} = props;

  let getBMIStatus = () => {
    let bmiScaleIndex = bmiScaleList.findIndex(
      (bmiScale) => BMIValue >= bmiScale.min && BMIValue <= bmiScale.max,
    );

    return bmiScaleIndex;
  };

  return (
    <View style={styles.boxShadow}>
      <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
        {`${BMIValue.toFixed(0)} `}
        <Text
          fontWeight="bold"
          style={{color: bmiScaleList[getBMIStatus()].color}}
        >
          {bmiScaleList[getBMIStatus()].title}
        </Text>
      </Text>
      <Text fontSize={TINY_FONT_SIZE} style={{color: GREY, marginBottom: 15}}>
        Your Current BMI
      </Text>

      <View style={styles.bmiBarContainer}>
        <View style={styles.underBar} />
        <View style={styles.healthyBar} />
        <View style={styles.overBar} />
        <View style={styles.obeseBar} />
      </View>
      <View style={{flexDirection: 'row', width: '100%'}}>
        <View style={styles.underContainer}>
          <Text fontSize={TINY_FONT_SIZE} style={{color: GREY}}>
            15
          </Text>
        </View>
        <View style={styles.normalContainer}>
          <Text fontSize={TINY_FONT_SIZE} style={{color: GREY}}>
            18.5
          </Text>
        </View>
        <View style={styles.overContainer}>
          <Text fontSize={TINY_FONT_SIZE} style={{color: GREY}}>
            25
          </Text>
        </View>
        <View style={styles.obeseContainer}>
          <Text fontSize={TINY_FONT_SIZE} style={{color: GREY}}>
            30
          </Text>
          <Text fontSize={TINY_FONT_SIZE} style={{color: GREY}}>
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
    backgroundColor: bmiScaleColor.under,
    borderRadius: 2,
    marginRight: 5,
  },
  healthyBar: {
    flex: 6.5,
    backgroundColor: bmiScaleColor.healthy,
    borderRadius: 2,
    marginRight: 5,
  },
  overBar: {
    flex: 5,
    backgroundColor: bmiScaleColor.over,
    borderRadius: 2,
    marginRight: 5,
  },
  obeseBar: {
    flex: 10,
    backgroundColor: bmiScaleColor.obese,
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
    right: 20,
    top: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
});
