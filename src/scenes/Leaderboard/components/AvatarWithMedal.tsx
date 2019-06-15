import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {
  medalGold,
  medalSilver,
  medalBronze,
} from '../../../assets/images/leaderboard';
import {Text} from '../../../generals/core-ui';
import {DARK_GREY70} from '../../../generals/constants/colors';

type Props = TouchableOpacityProps & {
  /**
   * Avatar URI to be rendered
   */
  avatarSource: ImageSourcePropType;
  /**
   * Avatar URI to be rendered
   */
  rank: 'gold' | 'silver' | 'bronze';
  /**
   * Name of user
   */
  name: string;
  /**
   * Point of user
   */
  points: number;
  /**
   * used to hide Avatar if true
   */
  avatarMinimized?: boolean;
};

export default function AvatarWithMedal(props: Props) {
  let {avatarSource, rank, name, points, avatarMinimized, onPress} = props;

  let containerStyle =
    rank === 'gold' ? styles.winnerContainer : styles.runnerUpContainer;
  let avatarStyle = [
    rank === 'gold' ? styles.winnerAvatar : styles.runnerUpAvatar,
    avatarMinimized && styles.minimizedAvatar,
  ];
  let medalImage =
    rank === 'gold' ? medalGold : rank === 'silver' ? medalSilver : medalBronze;

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={containerStyle}
      onPress={onPress}
    >
      <View style={[styles.imageShadow, avatarStyle]}>
        <Image
          source={avatarSource}
          style={avatarStyle}
          resizeMethod="scale"
          resizeMode="cover"
        />
      </View>
      <View style={styles.detailsContainer}>
        <Image
          source={medalImage}
          style={styles.medalImage}
          resizeMethod="scale"
          resizeMode="contain"
        />
        <Text fontWeight="bold" fontSize={14} style={{textAlign: 'center'}}>
          {name}
        </Text>
        <Text style={{color: DARK_GREY70, textAlign: 'center'}} fontSize={14}>
          {points}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  winnerContainer: {
    flex: 1.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 5,
    height: '100%',
  },
  runnerUpContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '80%',
  },
  detailsContainer: {
    marginTop: 25,
  },
  medalImage: {
    height: 55,
    width: 55,
    position: 'absolute',
    top: -55,
    alignSelf: 'center',
    zIndex: 3,
  },
  winnerAvatar: {
    height: 110,
    width: 110,
    borderRadius: 55,
  },
  runnerUpAvatar: {
    height: 85,
    width: 85,
    borderRadius: 42.5,
  },
  minimizedAvatar: {
    height: 0,
    width: 0,
    shadowColor: '#fff',
  },
  imageShadow: {
    shadowColor: '#ccc',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
    backgroundColor: 'grey',
  },
});
