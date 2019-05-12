import React from 'react';
import {StyleSheet, View, StyleProp, ViewStyle} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {BLUE, BLUE30} from '../constants/colors';
import {Text} from '../core-ui';
import {SMALL_FONT_SIZE} from '../constants/size';
type Props = {
  containerStyle?: StyleProp<ViewStyle>;
};
function LockedProgressGoal(props: Props) {
  let {containerStyle} = props;

  return (
    <View style={[styles.root, containerStyle]}>
      <View style={styles.labelContainer}>
        <View style={styles.iconContainer}>
          <Icon size={20} name="lock" color={BLUE} />
        </View>
        <View>
          <Text>Locked</Text>
          <Text fontWeight="light" fontSize={SMALL_FONT_SIZE}>
            Connect to Fitbit to unlock this goal
          </Text>
        </View>
      </View>
    </View>
  );
}

export default LockedProgressGoal;

const styles = StyleSheet.create({
  root: {
    height: 40,
  },
  labelContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: BLUE30,
  },
});
