import React from 'react';
import {View, StyleSheet, Image, ModalBaseProps} from 'react-native';
import {Text, Button} from '../../../generals/core-ui';
import {
  BLUE,
  LIGHT_GREY,
  LIGHTER_GREY,
  WHITE,
} from '../../../generals/constants/colors';
import {PopupDialog} from '../../../generals/components';
import {logoutWalk} from '../../../assets/images/bmr';

type Props = ModalBaseProps & {
  onOKPress: () => void;
};

export default function LogoutModal(props: Props) {
  let {visible = false, onRequestClose, onOKPress} = props;
  let _handleLogout = () => {
    onOKPress();
    onRequestClose && onRequestClose();
  };
  return (
    <PopupDialog
      visible={visible}
      onRequestClose={onRequestClose}
      containerStyle={styles.root}
    >
      <View style={styles.paddedContainer}>
        <Image
          source={logoutWalk}
          style={styles.modalImage}
          resizeMode="contain"
        />
        <Text style={{lineHeight: 24, textAlign: 'center', marginTop: 5}}>
          Are you sure you want to logout?
        </Text>
      </View>

      <View style={styles.footerBtnContainer}>
        <Button
          onPress={onRequestClose}
          style={styles.closeBtn}
          fontColor={BLUE}
        >
          Cancel
        </Button>
        <Button
          onPress={_handleLogout}
          style={styles.updateBtn}
          fontColor={BLUE}
        >
          Logout
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
