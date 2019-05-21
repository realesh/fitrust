import React from 'react';
import {
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
  View,
  ImageSourcePropType,
} from 'react-native';
import {AVATAR_SIZE_BIG, AVATAR_SIZE_SMALL} from '../constants/size';

type Props = {
  /**
   * avatar size (REQUIRED)
   */
  size: 'big' | 'small';

  /**
   * image uri to show as Avatar
   */
  source: ImageSourcePropType;

  /**
   * function to invoke when Avatar is pressed
   */
  onPress?: (event: GestureResponderEvent) => void;

  /**
   * style for the Avatar
   */
  style?: StyleProp<ViewStyle>;

  /**
   * shadow for the Avatar, default to true
   */
  shadow?: boolean;
};

/**
 * ---
 * Basic Info
 * ---
 * Core UI: Avatar
 * Description: Component to avatar
 *
 * ---
 * Props
 * ---
 *
 * __size__: avatar size (REQUIRED)
 *
 * __source__: image uri to show as Avatar
 *
 * __onPress__: function to invoke when Avatar is pressed
 *
 * __style__: style for the Avatar
 *
 */

export default function Avatar(props: Props) {
  let {source, size, style, onPress, shadow = true} = props;
  return onPress ? (
    <TouchableOpacity
      style={[styles[size], styles.shadow, style]}
      onPress={onPress}
    >
      <Image source={source} style={styles[size]} resizeMethod="scale" />
    </TouchableOpacity>
  ) : (
    <View style={[styles[size], shadow && styles.shadow, style]}>
      <Image source={source} style={styles[size]} resizeMethod="scale" />
    </View>
  );
}

const styles = StyleSheet.create({
  small: {
    height: AVATAR_SIZE_SMALL,
    width: AVATAR_SIZE_SMALL,
    borderRadius: AVATAR_SIZE_SMALL / 2,
  },
  big: {
    height: AVATAR_SIZE_BIG,
    width: AVATAR_SIZE_BIG,
    borderRadius: AVATAR_SIZE_BIG / 2,
  },
  shadow: {
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
    backgroundColor: 'grey',
  },
});
