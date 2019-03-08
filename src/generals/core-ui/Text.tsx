import React, {ReactNode} from 'react';
import {
  Text as BaseText,
  TextProps,
  StyleSheet,
  GestureResponderEvent,
  TouchableOpacity,
} from 'react-native';
import {DEFAULT_FONT_SIZE} from '../constants/size';

type Props = TextProps & {
  /**
   * Sets which font family to use. Defaults to regular.
   */
  fontWeight?: 'regular' | 'bold' | 'light';

  /*
   * Size of the font. Defaults to 14.
   */
  fontSize?: number;

  /*
   * React children.
   */
  children?: ReactNode;

  /*
   * Function to invoke when text pressed.
   */
  onPress?: (event: GestureResponderEvent) => void;
};

const Text = (props: Props) => {
  let {
    fontWeight = 'regular',
    fontSize = DEFAULT_FONT_SIZE,
    style,
    children,
    onPress,
    ...otherProps
  } = props;
  let fontFamily =
    fontWeight === 'regular'
      ? styles.regular
      : fontWeight === 'bold'
      ? styles.bold
      : styles.light;
  return onPress ? (
    <TouchableOpacity onPress={onPress}>
      <BaseText style={[fontFamily, {fontSize}, style]} {...otherProps}>
        {children}
      </BaseText>
    </TouchableOpacity>
  ) : (
    <BaseText style={[fontFamily, {fontSize}, style]} {...otherProps}>
      {children}
    </BaseText>
  );
};

export default Text;

const styles = StyleSheet.create({
  regular: {
    fontFamily: 'Lato-Regular',
  },
  bold: {
    fontFamily: 'Lato-Bold',
  },
  light: {
    fontFamily: 'Lato-Light',
  },
});
