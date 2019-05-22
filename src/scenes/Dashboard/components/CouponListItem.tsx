import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {Text} from '../../../generals/core-ui';
import {
  DARK_GREY70,
  LIGHTER_GREY,
  GREEN,
  WHITE,
  WHITE30,
  BLUE,
  GREEN30,
} from '../../../generals/constants/colors';
import {
  SMALL_FONT_SIZE,
  TINY_FONT_SIZE,
  LARGE_FONT_SIZE,
  HEADER_FONT_SIZE,
} from '../../../generals/constants/size';
import {ExerciseCoupon} from '../../../graphql/mutations/exerciseMode';

type Props = TouchableOpacityProps & {
  item: ExerciseCoupon;
};

export default function CouponListItem({item, onPress}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.couponContainer}
      onPress={onPress}
    >
      <View style={styles.couponTypeInfo}>
        <View style={styles.typeInitialBox}>
          <Text
            fontWeight="bold"
            fontSize={HEADER_FONT_SIZE}
            style={styles.whiteText}
          >
            {item.type[0]}
          </Text>
        </View>
      </View>
      <View style={styles.topSeparatorCircle} />
      <View style={styles.bottomSeparatorCircle} />
      <View style={styles.exDetailInfo}>
        <Text
          fontWeight="bold"
          fontSize={LARGE_FONT_SIZE}
          style={{marginBottom: 5}}
        >
          {item.type}
        </Text>
        <Text
          fontWeight="light"
          fontSize={SMALL_FONT_SIZE}
          style={{marginBottom: 3}}
        >
          {`${item.startTime} - ${item.finishTime}`}
        </Text>
        <Text
          fontWeight="light"
          fontSize={TINY_FONT_SIZE}
          style={{color: DARK_GREY70}}
        >
          {`issued date: ${item.date}`}
        </Text>
        <View style={styles.durationContainer}>
          <Text fontWeight="bold" style={{color: GREEN}}>
            {`${item.duration} mins`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  couponContainer: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: WHITE,
  },
  couponTypeInfo: {
    height: '100%',
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BLUE,
  },
  typeInitialBox: {
    height: 60,
    width: 60,
    backgroundColor: WHITE30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  whiteText: {color: WHITE},
  greenText: {color: GREEN},
  topSeparatorCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    position: 'absolute',
    left: 90,
    top: -10,
    backgroundColor: LIGHTER_GREY,
  },
  bottomSeparatorCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    position: 'absolute',
    left: 90,
    bottom: -10,
    backgroundColor: LIGHTER_GREY,
  },
  exDetailInfo: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  durationContainer: {
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: GREEN30,
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
