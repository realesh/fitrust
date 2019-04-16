import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  WHITE,
  BLUE,
  GREY,
  DARK_GREY70,
} from '../../../generals/constants/colors';
import {Text} from '../../../generals/core-ui';
import {SMALL_FONT_SIZE} from '../../../generals/constants/size';

export type SelectorItem = {
  title: string;
  desc: string | null;
};

export type SelectorData = Array<SelectorItem>;

export type SelectorItemOnPressFn = (index: number) => void;

type SelectorItemProps = {
  title: string;
  desc: string | null;
  isActive: boolean;
  onPress: () => void;
};

type SelectorProps = {
  data: SelectorData;
  selectedIndex: number;
  onItemPress: SelectorItemOnPressFn;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function Selector(props: SelectorProps) {
  let {data, selectedIndex, containerStyle, onItemPress} = props;

  let _checkActive = (index: number) => selectedIndex === index;

  return (
    <View style={[styles.root, containerStyle]}>
      {data.map((item, index) => {
        let setItemActive = () => onItemPress(index);
        return (
          <SelectorItem
            key={index}
            title={item.title.toLocaleUpperCase()}
            desc={item.desc}
            onPress={setItemActive}
            isActive={_checkActive(index)}
          />
        );
      })}
    </View>
  );
}

function SelectorItem(props: SelectorItemProps) {
  let {onPress, title, desc, isActive} = props;

  let containerStyle = isActive
    ? styles.activeContainerStyle
    : styles.inactiveContainerStyle;

  let textStyle = isActive ? styles.activeTextStyle : styles.inactiveTextStyle;
  let subTextStyle = isActive
    ? styles.activeSubTextStyle
    : styles.inactiveSubTextStyle;

  return (
    <TouchableOpacity
      style={[styles.activityLevelContainerStyle, containerStyle]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text fontWeight="bold" style={textStyle}>
        {title}
      </Text>
      {desc && (
        <Text fontSize={SMALL_FONT_SIZE} style={subTextStyle}>
          {desc}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  activityLevelContainerStyle: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: WHITE,
    marginBottom: 15,
  },
  activeContainerStyle: {
    borderColor: BLUE,
  },
  inactiveContainerStyle: {
    borderColor: GREY,
  },
  activeTextStyle: {
    color: BLUE,
  },
  inactiveTextStyle: {
    color: GREY,
  },
  activeSubTextStyle: {
    color: DARK_GREY70,
  },
  inactiveSubTextStyle: {
    color: GREY,
  },
});
