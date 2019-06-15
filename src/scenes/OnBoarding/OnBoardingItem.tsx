import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Text} from '../../generals/core-ui';
import {
  SCREEN_WIDTH,
  MEDIUM_FONT_SIZE,
  LARGE_FONT_SIZE,
} from '../../generals/constants/size';

type OnBoardingItemProps = {
  image: any;
  title: string;
  content: string;
};

export default function OnBoardingItem(props: OnBoardingItemProps) {
  let {image, title, content} = props;
  return (
    <View style={styles.root}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
          {title}
        </Text>
        <Text
          fontWeight="light"
          fontSize={MEDIUM_FONT_SIZE}
          style={{marginTop: 10, textAlign: 'center'}}
        >
          {content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  image: {
    flex: 3,
    width: '100%',
  },
  textContainer: {
    flex: 2,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
