import React from 'react';
import {View, StyleSheet, Image, ModalBaseProps} from 'react-native';
import {Text, Button} from '../../../generals/core-ui';
import {
  BLUE,
  LIGHT_GREY,
  LIGHTER_GREY,
  WHITE,
} from '../../../generals/constants/colors';
import {BIG_FONT_SIZE} from '../../../generals/constants/size';
import {PopupDialog} from '../../../generals/components';
import {calcResult} from '../../../assets/images/bmi';
import {bmiScaleList} from '../data/BMIData';

type Props = ModalBaseProps & {
  bmiResult: string;
  bmiScaleIndex: number;
  onUpdatePress: () => void;
};

export default function BMIResultModal(props: Props) {
  let {
    visible = false,
    onRequestClose,
    bmiResult,
    bmiScaleIndex,
    onUpdatePress,
  } = props;
  return (
    <PopupDialog
      visible={visible}
      onRequestClose={onRequestClose}
      containerStyle={styles.root}
    >
      <View style={styles.paddedContainer}>
        <Image
          source={calcResult}
          style={styles.modalImage}
          resizeMode="contain"
        />
        <Text fontWeight="bold" fontSize={BIG_FONT_SIZE}>
          {bmiResult}
        </Text>
        <Text
          fontWeight="bold"
          style={{color: bmiScaleList[bmiScaleIndex].color}}
        >
          {bmiScaleList[bmiScaleIndex].title}
        </Text>
        <Text style={{lineHeight: 24, textAlign: 'center', marginTop: 5}}>
          {bmiScaleList[bmiScaleIndex].desc}
        </Text>
      </View>

      <View style={styles.footerBtnContainer}>
        <Button
          onPress={onRequestClose}
          style={styles.closeBtn}
          fontColor={BLUE}
        >
          Close
        </Button>
        <Button
          onPress={onUpdatePress}
          style={styles.updateBtn}
          fontColor={BLUE}
        >
          Update
        </Button>
      </View>
    </PopupDialog>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 0,
  },
  paddedContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalImage: {
    height: 230,
    width: '100%',
  },
  footerBtnContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: LIGHT_GREY,
  },
  closeBtn: {
    flex: 1,
    backgroundColor: WHITE,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 0,
  },
  updateBtn: {
    flex: 1,
    backgroundColor: LIGHTER_GREY,
    paddingVertical: 15,
    borderRadius: 0,
  },
});
