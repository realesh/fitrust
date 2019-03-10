import React, {Component, ReactNode, Fragment} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';

import {BLUE, BLUE30, WHITE} from '../constants/colors';
import {SCREEN_WIDTH, DEFAULT_FONT_SIZE} from '../constants/size';
import {Text} from '../core-ui';

/**
 * Swiper
 * ---
 *
 * A horizontal scrollable view
 *
 * ---
 *
 * Props
 * ---
 *
 * __children__: Pages to be rendered.
 *
 * __onFinish__: Function to trigger when pressing button rendered on last children
 *
 */

type Props = {
  children: ReactNode;
  onFinish: () => void;
};

type State = {
  activeIndex: number;
  buttonAnimateValue: Animated.Value;
  dotAnimateValue: Array<Animated.Value>;
};

export default class Swiper extends Component<Props, State> {
  state: State = {
    activeIndex: 0,
    buttonAnimateValue: new Animated.Value(0),
    dotAnimateValue: [],
  };

  _scrollView?: ScrollView;

  render() {
    let {children, onFinish} = this.props;
    let {activeIndex, buttonAnimateValue, dotAnimateValue} = this.state;
    let childrenCount = React.Children.count(children);

    let buttonAnimateStyle = {
      bottom: buttonAnimateValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, 15],
      }),
    };

    return (
      <Fragment>
        <ScrollView
          ref={this._setScrollViewRef}
          horizontal={true}
          pagingEnabled={true}
          onMomentumScrollEnd={this._onScrollEnd}
          showsHorizontalScrollIndicator={false}
        >
          {React.Children.map(children, (child: ReactNode) => {
            return <View style={{width: SCREEN_WIDTH}}>{child}</View>;
          })}
        </ScrollView>

        {activeIndex !== childrenCount - 1 && (
          <View style={styles.footer}>
            <View style={styles.dotContainer}>
              {React.Children.map(children, (_item, index) => {
                let onPress = () => this._goToPage(index);
                let dotAnimateStyle = {
                  width: dotAnimateValue[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 30],
                  }),
                  backgroundColor: dotAnimateValue[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [BLUE30, BLUE],
                  }),
                };

                return (
                  <TouchableOpacity onPress={onPress}>
                    <Animated.View style={[styles.dot, dotAnimateStyle]} />
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity onPress={this._nextPage}>
              <Text style={{color: BLUE}}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        <Animated.View style={[styles.footerButton, buttonAnimateStyle]}>
          <TouchableOpacity onPress={onFinish} style={styles.clickableArea}>
            <Text
              fontWeight="bold"
              fontSize={DEFAULT_FONT_SIZE}
              style={{color: WHITE}}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Fragment>
    );
  }

  componentWillMount() {
    let {children} = this.props;
    let dotAnimatedValueArr = React.Children.map(children, (_item, index) => {
      if (index === 0) return new Animated.Value(1);
      return new Animated.Value(0);
    });

    this.setState({dotAnimateValue: dotAnimatedValueArr});
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    let {children} = this.props;
    let {activeIndex, dotAnimateValue} = this.state;
    let childrenCount = React.Children.count(children);
    if (activeIndex === childrenCount - 1) this._startAnimation(1);
    else this._startAnimation(0);

    if (prevState.activeIndex != activeIndex) {
      Animated.timing(dotAnimateValue[activeIndex], {
        toValue: 1,
        duration: 200,
      }).start();

      Animated.timing(dotAnimateValue[prevState.activeIndex], {
        toValue: 0,
        duration: 200,
      }).start();
    }
  }

  _startAnimation = (toValue: number) => {
    let {buttonAnimateValue} = this.state;
    Animated.timing(buttonAnimateValue, {
      toValue,
      duration: 200,
    }).start();
  };

  _setScrollViewRef = (scrollView: ScrollView) =>
    (this._scrollView = scrollView);

  _onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let screenWidth = SCREEN_WIDTH;
    this.setState({
      activeIndex: e.nativeEvent.contentOffset.x / screenWidth,
    });
  };

  _goToPage = (index: number) => {
    this.setState({activeIndex: index});
    this._scrollView &&
      this._scrollView.scrollTo({
        x: index * SCREEN_WIDTH,
        animated: true,
      });
  };

  _nextPage = () => {
    let {children} = this.props;
    let {activeIndex} = this.state;
    if (activeIndex < React.Children.count(children) - 1) {
      this._goToPage(activeIndex + 1);
    } else {
      this._goToPage(0);
    }
  };
}

const styles = StyleSheet.create({
  dot: {
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    height: 50,
    width: '100%',
  },
  dotContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: 50,
    width: '90%',
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
