import React from 'react';
import {
  View,
  StyleSheet,
  ViewProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {Text, Avatar} from '../../../generals/core-ui';
import {
  DARK_GREY70,
  WHITE,
  BLUE,
  BLUE30,
} from '../../../generals/constants/colors';

type Props = ViewProps &
  TouchableOpacityProps & {
    /**
     * User's number rank
     */
    rankNumber: number;
    /**
     * Name of user
     */
    name: string;
    /**
     * Point of user
     */
    points: number;
    /**
     * Avatar uri of user
     */
    avatarUri: string;
    /**
     * if true will render unique style container
     */
    currentUser?: boolean;
  };

export default function UserRowItem(props: Props) {
  let {
    rankNumber,
    name,
    points,
    avatarUri,
    currentUser = false,
    onPress,
    style,
  } = props;
  return (
    <TouchableOpacity
      style={[styles.userRowContainer, currentUser && styles.boxShadow, style]}
      onPress={onPress}
    >
      <Text
        style={{
          width: 30,
          color: currentUser ? BLUE30 : DARK_GREY70,
          textAlign: 'center',
          marginRight: 10,
        }}
        fontWeight={currentUser ? 'bold' : 'regular'}
      >
        {rankNumber}
      </Text>
      <Avatar
        source={avatarUri}
        size="small"
        shadow={false}
        style={styles.marginRight}
      />
      <View>
        <Text style={styles.marginRight} fontWeight="bold" fontSize={14}>
          {name}
        </Text>
        <Text
          style={[
            styles.marginRight,
            {color: currentUser ? BLUE : DARK_GREY70},
          ]}
          fontSize={14}
        >
          {points}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  marginRight: {marginRight: 15},
  userRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  boxShadow: {
    backgroundColor: WHITE,
    shadowColor: '#ccc',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: -4},
    elevation: 5,
  },
});
