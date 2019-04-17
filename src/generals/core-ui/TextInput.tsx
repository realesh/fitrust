import React, {Component} from 'react';
import {
  TextInput as BaseTextInput,
  StyleSheet,
  View,
  StyleProp,
  TextStyle,
  Animated,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {
  GREY,
  LIGHT_GREY,
  BLACK,
  SUCCESS_THEME_COLOR,
  ERROR_THEME_COLOR,
} from '../constants/colors';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateText,
} from '../../helpers/inputValidation';
import {
  DEFAULT_ICON_SIZE,
  MEDIUM_FONT_SIZE,
  TINY_FONT_SIZE,
} from '../constants/size';

type State = {
  filled: boolean;
  focus: boolean;
  focusAnimateValue: Animated.Value;
};

type Props = TextInputProps & {
  /**
   * Text input label (REQUIRED)
   */
  label: string;

  /**
   * Controlled value of the text input (REQUIRED)
   */
  value: string;

  /**
   * Controller to change input value (REQUIRED)
   */
  onChangeText: (text: string) => void;

  /**
   * Style for the TextInput Container
   */
  containerStyle?: StyleProp<TextStyle>;

  /**
   * If true, text input will be disabled
   */
  disabled?: boolean;

  /**
   * Style for the TextInput
   */
  inputStyle?: StyleProp<TextStyle>;

  /**
   * Type of text inputted
   */
  inputType?: INPUT_TYPE;

  /**
   * Icon name for input
   */
  iconName?: string;

  /**
   * if true, display error with message
   */
  error?: boolean;
};

type INPUT_TYPE = 'password' | 'email' | 'username' | 'text';

/**
 * ---
 * Basic Info
 * ---
 * Core UI: TextInput
 * Description: Component to input text
 *
 * ---
 * Props
 * ---
 *
 * __label__: text input label (REQUIRED)
 *
 * __value__: controlled value of the text input (REQUIRED)
 *
 * __onChangeText__: controller to change input value (REQUIRED)
 *
 * __containerStyle__: style for the TextInput Container
 *
 * __disabled__: if true, text input will be disabled
 *
 * __inputStyle__: style for the TextInput
 *
 * __inputType__: type of text inputted
 *
 * __iconName__: icon name for input
 *
 * __error__: if true, display error with message
 *
 * ---
 * Notes
 * ---
 * For other TextInput props, see https://facebook.github.io/react-native/docs/textinput
 */

export default class TextInput extends Component<Props, State> {
  state = {
    focus: false,
    filled: false,

    focusAnimateValue: new Animated.Value(0),
    validAnimateValue: new Animated.Value(0),
  };

  render() {
    let {filled, focusAnimateValue, validAnimateValue} = this.state;

    let {
      containerStyle,
      disabled,
      inputStyle,
      label,
      iconName,
      onChangeText,
      value,
      inputType,
      error,
      ...otherProps
    } = this.props;

    let checkValid = (input: string) => {
      let valid = false;
      switch (inputType) {
        case 'email':
          valid = validateEmail(input);
          break;
        case 'password':
          valid = validatePassword(input);
          break;
        case 'username': {
          valid = validateUsername(input);
          break;
        }
        default:
          valid = validateText(input);
      }

      if (valid) {
        Animated.timing(validAnimateValue, {
          toValue: 1,
          duration: 200,
        }).start();
      } else {
        Animated.timing(validAnimateValue, {
          toValue: 0,
          duration: 200,
        }).start();
      }

      return valid;
    };

    let labelStyle = {
      position: 'absolute',
      fontSize: filled
        ? TINY_FONT_SIZE
        : focusAnimateValue.interpolate({
            inputRange: [0, 1],
            outputRange: [MEDIUM_FONT_SIZE, TINY_FONT_SIZE],
          }),
      top:
        filled || this.props.value !== ''
          ? 10
          : focusAnimateValue.interpolate({
              inputRange: [0, 1],
              outputRange: [35, 10],
            }),
      left:
        filled || this.props.value !== ''
          ? 0
          : focusAnimateValue.interpolate({
              inputRange: [0, 1],
              outputRange: [2.5, 0],
            }),
      color: filled
        ? GREY
        : focusAnimateValue.interpolate({
            inputRange: [0, 1],
            outputRange: [BLACK, GREY],
          }),
      fontFamily: 'Lato-Regular',
    };

    let textInputStyle = {
      flexDirection: 'row-reverse',
      width: '100%',
      paddingBottom: 5,
      borderBottomWidth: 2,
      borderBottomColor: error
        ? ERROR_THEME_COLOR
        : validAnimateValue.interpolate({
            inputRange: [0, 1],
            outputRange: [LIGHT_GREY, SUCCESS_THEME_COLOR],
          }),
    };

    return (
      <View style={[styles.baseContainer, containerStyle]}>
        <View style={styles.container}>
          <Animated.Text style={labelStyle}>{label}</Animated.Text>
          <Animated.View style={textInputStyle}>
            <BaseTextInput
              {...otherProps}
              style={[styles.textInput, inputStyle]}
              onFocus={this._handleFocus}
              onBlur={this._handleBlur}
              onChangeText={onChangeText}
              value={value}
              editable={!disabled}
              secureTextEntry={inputType === 'password'}
              selectionColor={LIGHT_GREY}
            />
            {iconName && (
              <Icon
                name={
                  !filled
                    ? iconName
                    : !checkValid(value)
                    ? iconName
                    : 'check-circle'
                }
                size={DEFAULT_ICON_SIZE}
                color={
                  error
                    ? ERROR_THEME_COLOR
                    : !filled || !checkValid(value)
                    ? LIGHT_GREY
                    : SUCCESS_THEME_COLOR
                }
                style={styles.iconStyle}
              />
            )}
          </Animated.View>
        </View>
      </View>
    );
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    let {focus, focusAnimateValue} = this.state;
    let {value} = this.props;
    if (prevState.focus !== focus) {
      // Animate focus when state changed
      let toValue = focus ? 1 : 0;
      Animated.timing(focusAnimateValue, {
        toValue,
        duration: 200,
      }).start();
    }
    if (prevProps.value !== value) {
      // Change filled to true if input isn't empty
      if (value !== '') {
        this.setState({filled: true});
      } else {
        this.setState({filled: false});
      }
    }
  }

  _handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    let {onFocus} = this.props;
    onFocus && onFocus(e);
    this.setState({focus: true});
  };

  _handleBlur = () => {
    this.setState({focus: false});
  };
}

const styles = StyleSheet.create({
  baseContainer: {
    width: '100%',
  },
  container: {
    justifyContent: 'flex-end',
    height: 60,
    overflow: 'hidden',
  },
  textInputContainer: {
    flexDirection: 'row-reverse',
    width: '100%',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GREY,
  },
  textInput: {
    height: 20,
    fontSize: MEDIUM_FONT_SIZE,
    flex: 1,
    color: BLACK,
    fontFamily: 'Lato-Regular',
  },
  iconStyle: {
    position: 'absolute',
    bottom: 5,
    left: 5,
  },
});
