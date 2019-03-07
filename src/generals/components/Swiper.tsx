import React, {Component, ReactNode, Fragment} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {LinearGradient} from 'expo';

import {RED, RED30} from '../constants/colors';
import {SCREEN_WIDTH} from '../constants/size';
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
 */

type Props = {
  children: ReactNode;
};

type State = {
  activeIndex: number;
};

export default class Swiper extends Component<Props, State> {
  state = {
    activeIndex: 0,
  };

  _scrollView?: ScrollView;

  render() {
    let {children} = this.props;
    let {activeIndex} = this.state;

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

        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'white']}
          style={styles.footer}
        >
          <View style={styles.dotContainer}>
            {React.Children.map(children, (_item, index) => {
              let onPress = () => this._goToPage(index);
              return (
                <TouchableOpacity
                  onPress={onPress}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: index === activeIndex ? RED : RED30,
                    },
                  ]}
                />
              );
            })}
          </View>
          <TouchableOpacity onPress={this._nextPage}>
            <Text style={{color: RED}}>Next</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Fragment>
    );
  }

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
    if (activeIndex < React.Children.count(children) - 1)
      this._goToPage(activeIndex + 1);
    else this._goToPage(0);
  };
}

const styles = StyleSheet.create({
  dot: {width: 10, height: 10, borderRadius: 5, margin: 5},
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
});
