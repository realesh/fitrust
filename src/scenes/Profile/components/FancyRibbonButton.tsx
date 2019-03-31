import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  GestureResponderEvent,
  TouchableOpacity,
  View,
  ViewStyle,
  Animated,
} from 'react-native';
import {Text} from '../../../generals/core-ui';
import {
  SMALL_FONT_SIZE,
  DEFAULT_ICON_SIZE,
} from '../../../generals/constants/size';
import {Feather as Icon} from '@expo/vector-icons';

type Props = {
  /**
   * Function to invoke when button pressed.
   */
  onPress: (event: GestureResponderEvent) => void;

  position: 'left' | 'right';

  buttonColor: string;
  textColor: string;
  content: string;
  parentContainerBackgroundColor: string;
};

type State = {
  pullAnimatedValue: Animated.Value;
};

export default class FancyRibbonButton extends Component<Props, State> {
  state = {
    pullAnimatedValue: new Animated.Value(0),
  };

  render() {
    let {
      position,
      content,
      buttonColor,
      textColor,
      parentContainerBackgroundColor,
    } = this.props;
    let {pullAnimatedValue} = this.state;

    let topDecoStyle: ViewStyle = {
      borderBottomRightRadius: position === 'right' ? 50 : 0,
      borderBottomLeftRadius: position === 'left' ? 50 : 0,
      backgroundColor: parentContainerBackgroundColor,
    };

    let bottomDecoStyle: ViewStyle = {
      borderTopRightRadius: position === 'right' ? 50 : 0,
      borderTopLeftRadius: position === 'left' ? 50 : 0,
      backgroundColor: parentContainerBackgroundColor,
    };

    let rootStyle: ViewStyle = {
      alignItems: position === 'right' ? 'flex-end' : 'flex-start',
    };

    let leftButtonStyle: ViewStyle = {
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
      paddingRight: 20,
      paddingLeft: 10,
    };

    let rightButtonStyle: ViewStyle = {
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50,
      paddingRight: 10,
      paddingLeft: 20,
    };

    let buttonStyle: ViewStyle = {
      ...(position === 'right' ? rightButtonStyle : leftButtonStyle),
      backgroundColor: buttonColor,
      flexDirection: 'row',
    };

    let decoContainerColor = {
      backgroundColor: buttonColor,
    };

    let iconName = position === 'right' ? 'chevron-right' : 'chevron-left';

    let pullStyle = {
      height: '100%',
      width: pullAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 30],
      }),
    };

    return (
      <TouchableOpacity
        style={rootStyle}
        onPress={this._onPress}
        activeOpacity={1}
      >
        <View style={[styles.decoContainer, decoContainerColor]}>
          <View style={[styles.decoOverlay, topDecoStyle]} />
        </View>

        <View style={[styles.mainContainer, buttonStyle]}>
          {position === 'left' && (
            <Fragment>
              <Animated.View style={pullStyle} />
              <Icon
                name={iconName}
                size={DEFAULT_ICON_SIZE}
                color={textColor}
              />
            </Fragment>
          )}
          <Text fontSize={SMALL_FONT_SIZE} style={{color: textColor}}>
            {content}
          </Text>

          {position === 'right' && (
            <Fragment>
              <Icon
                name={iconName}
                size={DEFAULT_ICON_SIZE}
                color={textColor}
              />
              <Animated.View style={pullStyle} />
            </Fragment>
          )}
        </View>

        <View style={[styles.decoContainer, decoContainerColor]}>
          <View style={[styles.decoOverlay, bottomDecoStyle]} />
        </View>
      </TouchableOpacity>
    );
  }

  _onPress = () => {
    let {onPress} = this.props;
    let {pullAnimatedValue} = this.state;
    Animated.timing(pullAnimatedValue, {
      toValue: 1,
      duration: 200,
    }).start(this._shrinkButton);
    setTimeout(onPress, 100);
  };

  _shrinkButton = () => {
    let {pullAnimatedValue} = this.state;
    Animated.timing(pullAnimatedValue, {
      toValue: 0,
      duration: 200,
    }).start();
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  decoContainer: {
    height: 20,
    width: 20,
  },
  decoOverlay: {
    height: 20,
    width: 20,
  },
});
