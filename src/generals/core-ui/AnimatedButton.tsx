import React, {ReactNode, Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewProps,
  GestureResponderEvent,
  Animated,
} from 'react-native';
import {DEFAULT_FONT_SIZE} from '../constants/size';
import Text from './Text';
import {WHITE, BLUE} from '../constants/colors';

type Props = ViewProps & {
  /**
   * Size of the button's font. Defaults to 14.
   */
  fontSize?: number;

  /**
   * Text children to be displayed.
   */
  children?: ReactNode;

  /**
   * Function to invoke when button pressed.
   */
  onPress?: (event: GestureResponderEvent) => void;

  loading?: boolean;
};

type State = {
  buttonAnimateValue: Animated.Value;
};

export default class AnimatedButton extends Component<Props, State> {
  state = {
    buttonAnimateValue: new Animated.Value(0),
  };

  render() {
    let {buttonAnimateValue} = this.state;
    let {
      fontSize = DEFAULT_FONT_SIZE,
      children,
      style,
      onPress,
      loading,
      ...otherProps
    } = this.props;

    let animateStyle = {
      width: buttonAnimateValue.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 30],
      }),
      height: buttonAnimateValue.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 30],
      }),
      borderRadius: buttonAnimateValue.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 15],
      }),
    };

    return loading ? (
      <View style={[styles.container, style]}>
        <Animated.View
          style={[styles.loadingBar, animateStyle]}
          {...otherProps}
        />
      </View>
    ) : (
      <View style={[styles.container, style]}>
        <Animated.View style={styles.button} {...otherProps}>
          <TouchableOpacity onPress={onPress} style={styles.clickableArea}>
            <Text fontWeight="bold" fontSize={fontSize} style={{color: WHITE}}>
              {children}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  componentDidUpdate(prevProps: Props) {
    let {loading} = this.props;
    let {buttonAnimateValue} = this.state;
    if (prevProps.loading != loading && loading) {
      this._animateProgress(buttonAnimateValue);
    } else if (prevProps.loading != loading && !loading) {
      Animated.timing(buttonAnimateValue, {
        toValue: 0,
        duration: 300,
      }).start();
    }
  }

  _animateProgress = (progressAnimateValue: Animated.Value) => {
    let {loading} = this.props;
    if (loading) {
      let toZero = () => {
        Animated.timing(progressAnimateValue, {
          toValue: 0,
          duration: 300,
        }).start(() => this._animateProgress(progressAnimateValue));
      };

      Animated.timing(progressAnimateValue, {
        toValue: 1,
        duration: 300,
      }).start(toZero);
    } else {
      progressAnimateValue.stopAnimation();
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: BLUE,
    alignSelf: 'center',
  },
  loadingBar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: BLUE,
    alignSelf: 'center',
  },
  clickableArea: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
