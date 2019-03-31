import React, {ReactNode} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewProps,
  GestureResponderEvent,
} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {TINY_FONT_SIZE} from '../constants/size';
import Text from './Text';
import {LIGHT_GREY, BLUE} from '../constants/colors';

type Props = ViewProps & {
  /**
   * controlled value of CheckLabel (REQUIRED)
   */
  checked: boolean;

  /**
   * Function to invoke when button pressed.
   */
  onPress: (event: GestureResponderEvent) => void;

  /**
   * Text children to be displayed.
   */
  children?: ReactNode;
};

const CheckLabel = (props: Props) => {
  let {checked, onPress, children, style} = props;

  let iconName = checked ? 'check-circle' : 'circle';
  let color = checked ? BLUE : LIGHT_GREY;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Icon name={iconName} size={14} color={color} style={{marginRight: 5}} />
      <Text fontSize={TINY_FONT_SIZE} style={{color}}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckLabel;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
