import React from 'react';
import {
  StyleSheet,
  ViewProps,
  GestureResponderEvent,
  TouchableOpacity,
  View,
} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {Text} from '../../generals/core-ui';
import {BLUE} from '../../generals/constants/colors';
import {BIG_FONT_SIZE} from '../../generals/constants/size';

type ScalableItemProps = ViewProps & {
  title: string;
  value: number;
  onPlusPress: (event: GestureResponderEvent) => void;
  onMinusPress: (event: GestureResponderEvent) => void;
};

export default function ScalableItem(props: ScalableItemProps) {
  let {title, value, onPlusPress, onMinusPress, style} = props;
  return (
    <View style={[styles.rowItem, style]}>
      <Text style={{marginBottom: 5}}>{title}</Text>
      <Text
        fontWeight="bold"
        fontSize={BIG_FONT_SIZE}
        style={{marginBottom: 10}}
      >
        {value}
      </Text>
      <View style={styles.iconButtonContainer}>
        <TouchableOpacity onPress={onMinusPress}>
          <Icon name="minus-circle" size={30} color={BLUE} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPlusPress}>
          <Icon name="plus-circle" size={30} color={BLUE} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconButtonContainer: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-around',
  },
});
