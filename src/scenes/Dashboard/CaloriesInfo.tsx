import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ViewProps,
  GestureResponderEvent,
} from 'react-native';
import {Text, Button} from '../../generals/core-ui';
import {SMALL_FONT_SIZE} from '../../generals/constants/size';
import {GREY, BLUE, WHITE} from '../../generals/constants/colors';

type OnBoardingItemProps = ViewProps & {
  image: any;
  currentValue: number;
  maxValue: number;
  buttonTitle?: string;
  onPress?: (event: GestureResponderEvent) => void;
};

export default function CaloriesInfo(props: OnBoardingItemProps) {
  let {image, currentValue, maxValue, buttonTitle, onPress = () => {}} = props;
  return (
    <View style={{flex: 1, paddingHorizontal: 5, alignItems: 'center'}}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text fontSize={20} fontWeight="bold">
          {currentValue}
          <Text style={{color: GREY}} fontSize={SMALL_FONT_SIZE}>
            {' '}
            / {maxValue} cals
          </Text>
        </Text>
      </View>
      <Button
        onPress={onPress}
        style={styles.recordButton}
        fontSize={SMALL_FONT_SIZE}
        fontColor={BLUE}
      >
        + {buttonTitle}
      </Button>
      <Button iconName="info" style={styles.infoButton} fontColor={GREY} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {width: 50, height: 50, marginBottom: 0},
  recordButton: {
    backgroundColor: WHITE,
    paddingVertical: 5,
    marginTop: 10,
    width: '90%',
    shadowColor: '#aaa',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  infoButton: {
    position: 'absolute',
    right: 10,
    top: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: WHITE,
  },
});