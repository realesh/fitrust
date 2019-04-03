import React, {ReactNode} from 'react';
import {
  TouchableOpacity,
  ViewProps,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import {DEFAULT_FONT_SIZE} from '../constants/size';
import Text from './Text';
import {WHITE, BLUE} from '../constants/colors';
import {Feather as Icon} from '@expo/vector-icons';

type Props = ViewProps & {
  /**
   * Size of the button's font. Defaults to 14.
   */
  fontSize?: number;

  fontColor?: string;

  iconName?: string;

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
    fontColor = WHITE,
    iconName,
    children,
    style,
    onPress,
    ...otherProps
  } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[styles.clickableArea, style]}
      {...otherProps}
    >
      {iconName && <Icon name={iconName} size={fontSize} color={fontColor} />}
      {children && (
        <Text
          fontWeight="bold"
          fontSize={fontSize}
          style={{color: fontColor, marginLeft: 5}}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
  },
  clickableArea: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BLUE,
    borderRadius: 10,
  },
});
