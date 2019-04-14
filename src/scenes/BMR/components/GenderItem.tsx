import React from 'react';
import {
  StyleSheet,
  Image,
  ViewProps,
  GestureResponderEvent,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import {Text} from '../../../generals/core-ui';

type GenderItemProps = ViewProps & {
  imageSource: ImageSourcePropType;
  text: string;
  onPress: (event: GestureResponderEvent) => void;
};

export default function GenderItem(props: GenderItemProps) {
  let {imageSource, text, style, onPress = () => {}} = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.genderItemContainer, style]}
      activeOpacity={0.6}
    >
      <Image source={imageSource} style={styles.image} resizeMethod="scale" />
      <Text>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  genderItemContainer: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  image: {width: 96, height: 96},
});
