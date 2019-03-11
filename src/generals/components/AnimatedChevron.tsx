import React, {Component} from 'react';
import {StyleSheet, ViewProps, Animated} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {GREY} from '../constants/colors';

type Props = ViewProps & {
  /**
   * size of chevron icon
   */
  size?: number;

  /**
   * color of chevron icon
   */
  color?: string;
};

export default class AnimatedChevron extends Component<Props> {
  state = {
    translateValue: new Animated.Value(0),
  };
  render() {
    let {size = 30, color = GREY, style} = this.props;
    let {translateValue} = this.state;

    let translateStyle = {
      bottom: translateValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-3, 5],
      }),
    };

    return (
      <Animated.View style={[styles.scrollChevron, translateStyle, style]}>
        <Icon name="chevron-up" size={size} color={color} />
      </Animated.View>
    );
  }

  _animateChevron = () => {
    let {translateValue} = this.state;

    let toZero = () => {
      Animated.timing(translateValue, {
        toValue: 0,
        duration: 500,
      }).start(() => this._animateChevron());
    };

    Animated.timing(translateValue, {
      toValue: 1,
      duration: 500,
    }).start(toZero);
  };

  componentDidMount() {
    this._animateChevron();
  }
}

const styles = StyleSheet.create({
  scrollChevron: {
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 5,
  },
});
