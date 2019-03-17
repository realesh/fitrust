import React from 'react';
import {
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
  View,
} from 'react-native';
import MALE_AVATAR from '../../assets/images/male-avatar.jpeg';
import {AVATAR_SIZE_BIG, AVATAR_SIZE_SMALL} from '../constants/size';

type Props = {
  /**
   * avatar size (REQUIRED)
   */
  size: 'big' | 'small';

  /**
   * image uri to show as Avatar
   */
  source?: string;

  /**
   * function to invoke when Avatar is pressed
   */
  onPress?: (event: GestureResponderEvent) => void;

  /**
   * style for the Avatar
   */
  style?: StyleProp<ViewStyle>;
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
  let {source, size, style, onPress} = props;
  return onPress ? (
    <TouchableOpacity
      style={[styles[size], styles.shadow, style]}
      onPress={onPress}
    >
      <Image
        source={source ? {uri: source} : MALE_AVATAR}
        style={styles[size]}
        resizeMethod="scale"
      />
    </TouchableOpacity>
  ) : (
    <View style={[styles[size], styles.shadow, style]}>
      <Image
        source={source ? {uri: source} : MALE_AVATAR}
        style={styles[size]}
        resizeMethod="scale"
      />
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
