import React from 'react';
import {StyleSheet, View, StyleProp, ViewStyle} from 'react-native';
import GenderItem from './GenderItem';
import {
  maleActive,
  maleInactive,
  femaleActive,
  femaleInactive,
} from '../../../assets/images/bmr';
import {WHITE, BLUE, LIGHT_GREY} from '../../../generals/constants/colors';

export type GenderType = 'male' | 'female';
export type GenderOnPressFn = (gender: GenderType) => void;

type GenderItemProps = {
  selectedGender: GenderType;
  onItemPress: GenderOnPressFn;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function GenderSelector(props: GenderItemProps) {
  let {selectedGender, onItemPress, containerStyle} = props;

  let _setGenderToMale = () => onItemPress('male');
  let _setGenderToFemale = () => onItemPress('female');

  let _checkActive = (
    gender: 'male' | 'female',
    type: 'image' | 'container',
  ) => {
    if (gender === 'male') {
      if (type === 'image') {
        return selectedGender === 'male' ? maleActive : maleInactive;
      } else if (type === 'container') {
        return selectedGender === 'male'
          ? styles.activeGenderContainerStyle
          : styles.inactiveGenderContainerStyle;
      }
    } else if (gender === 'female') {
      if (type === 'image') {
        return selectedGender === 'female' ? femaleActive : femaleInactive;
      } else if (type === 'container') {
        return selectedGender === 'female'
          ? styles.activeGenderContainerStyle
          : styles.inactiveGenderContainerStyle;
      }
    }
  };

  return (
    <View style={[styles.root, containerStyle]}>
      <GenderItem
        onPress={_setGenderToMale}
        style={[_checkActive('male', 'container'), {marginRight: 10}]}
        imageSource={_checkActive('male', 'image')}
        text="Male"
      />
      <GenderItem
        onPress={_setGenderToFemale}
        style={[_checkActive('female', 'container'), {marginLeft: 10}]}
        imageSource={_checkActive('female', 'image')}
        text="Female"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flexDirection: 'row'},
  activeGenderContainerStyle: {
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: BLUE,
  },
  inactiveGenderContainerStyle: {
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: LIGHT_GREY,
  },
});
