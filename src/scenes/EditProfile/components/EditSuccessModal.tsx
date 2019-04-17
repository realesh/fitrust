import React from 'react';
import {StyleSheet, Image, ModalBaseProps} from 'react-native';
import {Text, Button} from '../../../generals/core-ui';
import {BLUE, WHITE} from '../../../generals/constants/colors';
import {LARGE_FONT_SIZE} from '../../../generals/constants/size';
import {PopupDialog} from '../../../generals/components';
import {editProfile} from '../../../assets/images/profile';

type Props = ModalBaseProps & {
  onClosePress: () => void;
};

export default function EditSuccessModal(props: Props) {
  let {visible = false, onRequestClose, onClosePress} = props;
  return (
    <PopupDialog visible={visible} onRequestClose={onRequestClose}>
      <Image source={editProfile} style={styles.image} resizeMode="contain" />
      <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
        Yeay!
      </Text>
      <Text style={{lineHeight: 24, textAlign: 'center', marginTop: 5}}>
        Profile has been succesfully updated!
      </Text>
      <Button
        onPress={onClosePress}
        style={styles.interactButton}
        fontColor={BLUE}
      >
        Close
      </Button>
    </PopupDialog>
  );
}

const styles = StyleSheet.create({
  paddedContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  image: {
    height: 250,
    width: '100%',
  },
  interactButton: {
    backgroundColor: WHITE,
    marginTop: 20,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BLUE,
    width: '90%',
  },
});
