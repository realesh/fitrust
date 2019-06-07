import React from 'react';
import {View, StyleSheet, TouchableOpacityProps, Image} from 'react-native';
import {Text} from '../../../generals/core-ui';
import {DARK_GREY70} from '../../../generals/constants/colors';
import {lockedBadge} from '../../../assets/images/badges';
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
    <View style={[styles.badgeRowContainer, style]}>
      <Image
        source={unlocked ? {uri: thumbUri} : lockedBadge}
        style={unlocked ? styles.imageUnlocked : styles.imageLocked}
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
    </View>
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
  imageUnlocked: {
    height: 60,
    width: 60,
    marginRight: 20,
  },
  imageLocked: {
    height: 50,
    width: 50,
    marginLeft: 5,
    marginRight: 25,
    marginVertical: 10,
  },
  descText: {
    color: DARK_GREY70,
  },
});
