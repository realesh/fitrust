import React, {Component} from 'react';
import {
  View,
  Modal,
  ModalProps,
  StyleSheet,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  Animated,
  TouchableOpacity,
} from 'react-native';

import {
  WHITE,
  GREY,
  BLUE,
  LIGHT_BLUE,
  DARK_GREY70,
  LIGHT_GREY,
} from '../constants/colors';
import {LinearGradient} from 'expo';
import {Text, Button} from '../core-ui';
import {LARGE_FONT_SIZE} from '../constants/size';

type Props = ModalProps & {
  /**
   * The Popup's title.
   */
  title?: string;

  /**
   * The Popup's message.
   */
  message?: string;

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

  /**
   * Show button if there's props
   */
  buttonTitle?: string;

  /**
   * Function to invoke when pressing requested button
   */
  buttonOnPress?: () => void;
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
 * __title__: (optional) the Popup's title.
 *
 * __message__: (optional) the Popup's message.
 *
 * __visible__: decides whether to display (true) or hide (false) Popup.
 *
 * __onRequestClose__: a callback which will be called when pressing default button or pressing outside the Popup box.
 *
 * __containerStyle__: style for the popup container
 *
 * @see https://facebook.github.io/react-native/docs/modal#props
 *
 */

class PopupInfoDialog extends Component<Props> {
  state = {
    spinValue: new Animated.Value(0),
  };

  componentDidUpdate(prevProps: Props) {
    let {spinValue} = this.state;

    if (!prevProps.visible && this.props.visible) {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 0.875,
        duration: 300,
      }).start(() =>
        Animated.timing(spinValue, {
          toValue: 0.25,
          duration: 200,
        }).start(() =>
          Animated.timing(spinValue, {
            toValue: 0.5,
            duration: 100,
          }).start(),
        ),
      );
    }
  }

  render() {
    let {
      title,
      message,
      onRequestClose,
      visible,
      containerStyle,
      buttonTitle,
      buttonOnPress,
      ...otherProps
    } = this.props;

    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['-30deg', '30deg'],
    });

    let spinStyle = {
      fontFamily: 'Lato-Bold',
      fontSize: 35,
      transform: [{rotate: spin}],
      color: WHITE,
    };

    return visible ? (
      <Modal
        transparent={true}
        animationType="fade"
        onRequestClose={onRequestClose}
        {...otherProps}
      >
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View style={styles.root}>
            <TouchableWithoutFeedback>
              <View style={styles.content}>
                <LinearGradient
                  colors={[BLUE, LIGHT_BLUE]}
                  start={[0, 0.5]}
                  end={[0.5, 0]}
                  style={styles.attributeContainer}
                >
                  <Animated.Text style={spinStyle}>i</Animated.Text>
                </LinearGradient>
                <View style={styles.titleContainer}>
                  <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                    {title}
                  </Text>
                </View>
                <Text style={{lineHeight: 24, textAlign: 'center'}}>
                  {message}
                </Text>

                {buttonTitle && (
                  <Button
                    onPress={buttonOnPress}
                    style={styles.interactButton}
                    fontColor={BLUE}
                  >
                    {buttonTitle}
                  </Button>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    ) : null;
  }
}

export default PopupInfoDialog;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DARK_GREY70,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  content: {
    backgroundColor: WHITE,
    borderRadius: 10,
    width: '100%',
    maxHeight: '80%',
    alignItems: 'center',
    overflow: 'visible',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalPage: {
    flex: 1,
    width: '100%',
    maxHeight: '80%',
    backgroundColor: WHITE,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  button: {paddingHorizontal: 17, paddingVertical: 15, alignSelf: 'flex-end'},
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
