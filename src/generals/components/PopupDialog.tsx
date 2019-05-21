import React, {ReactNode} from 'react';
import {
  View,
  Modal,
  ModalProps,
  StyleSheet,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from 'react-native';

import {WHITE, GREY, BLUE, LIGHT_GREY} from '../constants/colors';
import {BlurView} from 'expo';

type Props = ModalProps & {
  /**
   * Decides whether to display (true) or hide (false) Popup.
   */
  visible: boolean;

  /**
   * Callback which will be called when pressing default button or pressing outside the Popup box.
   */
  onRequestClose?: () => void;

  /**
   * style for the popup container
   */
  containerStyle?: StyleProp<ViewStyle>;

  children: ReactNode;
};

/**
 * Popup
 * ---
 *
 * A styled modal to show information
 *
 * ---
 *
 * Props
 * ---
 *
 * __visible__: decides whether to display (true) or hide (false) Popup.
 *
 * __onRequestClose__: a callback which will be called when pressing default button or pressing outside the Popup box.
 *
 * __containerStyle__: style for the popup container
 *
 * __children__: children to render
 *
 * @see https://facebook.github.io/react-native/docs/modal#props
 *
 */

function PopupDialog(props: Props) {
  let {
    onRequestClose,
    visible,
    containerStyle,
    children,
    ...otherProps
  } = props;

  return visible ? (
    <Modal
      transparent={true}
      animationType="fade"
      onRequestClose={onRequestClose}
      {...otherProps}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <BlurView
          tint="dark"
          intensity={100}
          style={[StyleSheet.absoluteFill, styles.root]}
        >
          <TouchableWithoutFeedback>
            <View style={[styles.content, containerStyle]}>{children}</View>
          </TouchableWithoutFeedback>
          {/* </View> */}
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  ) : null;
}

export default PopupDialog;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  content: {
    backgroundColor: WHITE,
    borderRadius: 10,
    width: '100%',
    maxHeight: '100%',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 20,
  },
  modalPage: {
    flex: 1,
    width: '100%',
    maxHeight: '100%',
    backgroundColor: WHITE,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  messageText: {marginBottom: 8, color: GREY},
  titleText: {marginBottom: 12},
  attributeContainer: {
    position: 'absolute',
    top: -35,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    minWidth: 70,
    paddingHorizontal: 20,
    borderRadius: 35,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GREY,
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
