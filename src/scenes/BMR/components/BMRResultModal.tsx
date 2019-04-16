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
import {bmrCalcResult} from '../../../assets/images/bmr';

type Props = ModalBaseProps & {
  tdeeResult: string;
  goalResult: string;
  onUpdatePress: () => void;
};

export default function BMRResultModal(props: Props) {
  let {
    visible = false,
    onRequestClose,
    goalResult,
    tdeeResult,
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
          source={bmrCalcResult}
          style={styles.modalImage}
          resizeMode="contain"
        />

        <View style={styles.flexRow}>
          <View style={styles.insightContainer}>
            <Text fontWeight="bold" fontSize={BIG_FONT_SIZE}>
              {tdeeResult}
            </Text>
            <Text fontWeight="bold" style={{color: BLUE}}>
              TDEE
            </Text>
          </View>
          <View style={styles.insightContainer}>
            <Text fontWeight="bold" fontSize={BIG_FONT_SIZE}>
              {goalResult}
            </Text>
            <Text fontWeight="bold" style={{color: BLUE}}>
              Goal
            </Text>
          </View>
        </View>
        <Text style={{lineHeight: 24, textAlign: 'center', marginTop: 5}}>
          TDEE is the number of cals burned by your body based on your activity
          level during the day. Goal is the number of cals that you should take
          depending on your desired goals!
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
    height: 200,
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
  flexRow: {
    flexDirection: 'row',
  },
  insightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
