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
import DEFAULT_AVATAR from '../../assets/images/default-avatar.png';
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
    <TouchableOpacity style={style} onPress={onPress}>
      <Image
        source={source ? {uri: source} : DEFAULT_AVATAR}
        style={styles[size]}
      />
    </TouchableOpacity>
  ) : (
    <View style={style}>
      <Image
        source={source ? {uri: source} : DEFAULT_AVATAR}
        style={styles[size]}
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
  image: {
    flex: 1,
    width: '100%',
  },
});
