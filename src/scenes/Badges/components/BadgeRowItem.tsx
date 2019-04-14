import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  Image,
} from 'react-native';
import {Text} from '../../../generals/core-ui';
import {
  LIGHT_TEXT_COLOR,
  DARK_GREY70,
} from '../../../generals/constants/colors';
import {lockedBadge, mhrBadge} from '../../../assets/images/badges';
import {MEDIUM_FONT_SIZE} from '../../../generals/constants/size';

type Props = TouchableOpacityProps & {
  /**
   * Name of badge
   */
  name: string;
  /**
   * Description of badge
   */
  desc: string;
  /**
   * Thumb uri of badge
   */
  thumbUri: string;
  /**
   * Status of the badge
   */
  unlocked?: boolean;
};

export default function BadgeRowItem(props: Props) {
  let {name, desc, thumbUri, style, unlocked} = props;
  return (
    <TouchableOpacity
      style={[styles.badgeRowContainer, style]}
      onPress={() => {}}
      activeOpacity={0.6}
    >
      <Image
        source={unlocked ? mhrBadge : lockedBadge}
        style={styles.image}
        resizeMethod="scale"
      />
      <View style={styles.flex}>
        <Text fontWeight="bold" fontSize={MEDIUM_FONT_SIZE}>
          {name}
        </Text>
        <Text style={styles.descText} fontSize={14} numberOfLines={2}>
          {desc}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  marginRight: {marginRight: 15},
  badgeRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  image: {
    height: 56,
    width: 56,
    marginRight: 20,
  },
  descText: {
    color: DARK_GREY70,
  },
});