import React, {ReactNode} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewProps,
  GestureResponderEvent,
} from 'react-native';
import {DEFAULT_FONT_SIZE} from '../constants/size';
import Text from './Text';
import {WHITE, BLUE} from '../constants/colors';

type Props = ViewProps & {
  /**
   * Size of the button's font. Defaults to 14.
   */
  fontSize?: number;

  /**
   * Text children to be displayed.
   */
  children?: ReactNode;

  /**
   * Function to invoke when button pressed.
   */
  onPress?: (event: GestureResponderEvent) => void;
};

const Button = (props: Props) => {
  let {
    fontSize = DEFAULT_FONT_SIZE,
    children,
    style,
    onPress,
    ...otherProps
  } = props;
  return (
    <View style={[styles.button, style]} {...otherProps}>
      <TouchableOpacity onPress={onPress} style={styles.clickableArea}>
        <Text fontWeight="bold" fontSize={fontSize} style={{color: WHITE}}>
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '100%',
    borderRadius: 10,
    backgroundColor: BLUE,
    alignSelf: 'center',
  },
  clickableArea: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
