import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Slider,
  LayoutAnimation,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';

import {Text, Button} from '../../generals/core-ui';
import {
  BIG_FONT_SIZE,
  MEDIUM_FONT_SIZE,
  SCREEN_WIDTH,
} from '../../generals/constants/size';
import {sliderThumb} from '../../assets/images/bmr';
import {
  WHITE,
  LIGHT_GREY,
  GREY,
  BLUE,
  LIGHTER_GREY,
} from '../../generals/constants/colors';
import {Toolbar} from '../../generals/components';
import ScalableItem from './components/ScalableItem';
import AnimatedButton from '../../generals/core-ui/AnimatedButton';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import PopupInfoDialog from '../../generals/components/PopupInfoDialog';
import GenderSelector, {
  GenderOnPressFn,
  GenderType,
} from './components/GenderSelector';

type Props = NavigationScreenProps;

type State = {
  selectedGender: GenderType;
  heightValue: number;
  weightValue: number;
  ageValue: number;
  loading: boolean;
  resultModalVisible: boolean;
  activeIndex: number;
};

export default class BMRCalculatorScene extends Component<Props, State> {
  state: State = {
    selectedGender: 'male',
    heightValue: 175,
    weightValue: 92,
    ageValue: 22,
    loading: false,
    resultModalVisible: false,
    activeIndex: 0,
  };

  _scrollView?: ScrollView;

  render() {
    let {navigation} = this.props;
    let {
      heightValue,
      weightValue,
      ageValue,
      loading,
      resultModalVisible,
      activeIndex,
      selectedGender,
    } = this.state;

    return (
      <View style={styles.root}>
        <Toolbar navigation={navigation} title="BMR" subtitle="Calculator" />
        <ScrollView
          ref={this._setScrollViewRef}
          horizontal={true}
          pagingEnabled={true}
          onMomentumScrollEnd={this._onScrollEnd}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        >
          <View style={styles.screenWidth}>
            <View style={styles.paddedContainer}>
              <GenderSelector
                selectedGender={selectedGender}
                onItemPress={this._onGenderChange}
              />

              <View style={styles.heightContainer}>
                <Text style={{marginBottom: 5}}>Height</Text>
                <Text fontWeight="bold" fontSize={BIG_FONT_SIZE}>
                  {heightValue}{' '}
                  <Text
                    fontWeight="bold"
                    fontSize={MEDIUM_FONT_SIZE}
                    style={{color: GREY, marginBottom: 5}}
                  >
                    cm
                  </Text>
                </Text>
                <Slider
                  minimumValue={100}
                  maximumValue={250}
                  value={heightValue}
                  minimumTrackTintColor={BLUE}
                  maximumTrackTintColor={LIGHT_GREY}
                  step={1}
                  thumbImage={sliderThumb}
                  thumbTintColor={BLUE}
                  onValueChange={this._onHeightChange}
                  style={{width: '100%'}}
                />
              </View>

              <View style={styles.rowContainer}>
                <ScalableItem
                  title="Weight"
                  value={weightValue}
                  onMinusPress={this._onWeightMinus}
                  onPlusPress={this._onWeightPlus}
                  style={styles.rowItemFirst}
                />
                <ScalableItem
                  title="Age"
                  value={ageValue}
                  onMinusPress={this._onAgeMinus}
                  onPlusPress={this._onAgePlus}
                  style={styles.rowItemLast}
                />
              </View>
            </View>
          </View>

          <View style={styles.screenWidth} />

          <PopupInfoDialog
            visible={resultModalVisible}
            title="Your BMR"
            message="Lorem Ipsum"
            onRequestClose={this._toggleResultModal}
            buttonTitle="Got it"
            buttonOnPress={this._toggleResultModal}
          />
        </ScrollView>

        {/* NAV BUTTON */}
        <View style={styles.footerContainer}>
          {activeIndex === 0 ? (
            <Button onPress={this._nextPage} style={styles.navButton}>
              Next
            </Button>
          ) : (
            <AnimatedButton onPress={this._onCalcPress} loading={loading}>
              Calculate
            </AnimatedButton>
          )}
        </View>
      </View>
    );
  }

  _onGenderChange: GenderOnPressFn = (gender) => {
    this.setState({selectedGender: gender});
  };

  _onHeightChange = (value: number) =>
    this.setState({heightValue: Math.floor(value)});

  _onWeightPlus = () =>
    this.setState({weightValue: this.state.weightValue + 1});
  _onWeightMinus = () =>
    this.setState({weightValue: this.state.weightValue - 1});

  _onAgePlus = () => this.setState({ageValue: this.state.ageValue + 1});
  _onAgeMinus = () => this.setState({ageValue: this.state.ageValue - 1});

  _onCalcPress = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({loading: true});

    setTimeout(this._toggleResultModal, 1000);
  };
  _toggleResultModal = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({
      resultModalVisible: !this.state.resultModalVisible,
      loading: false,
    });
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
    this._goToPage(1);
  };
  _prevPage = () => {
    this._goToPage(0);
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screenWidth: {
    width: SCREEN_WIDTH,
  },
  paddedContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: WHITE,
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  activeGenderContainerStyle: {
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: BLUE,
  },
  inactiveGenderContainerStyle: {
    backgroundColor: WHITE,
    borderWidth: 2,
    borderColor: LIGHT_GREY,
  },
  image: {
    height: 96,
    width: 96,
  },
  heightContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rowItemFirst: {
    borderRightWidth: 1,
    borderRightColor: LIGHTER_GREY,
  },
  rowItemLast: {
    borderLeftWidth: 1,
    borderLeftColor: LIGHTER_GREY,
  },
  navButton: {
    height: 50,
    // width: '50%',
  },
});
