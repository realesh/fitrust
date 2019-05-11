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
import GenderSelector, {
  GenderOnPressFn,
  GenderType,
} from './components/GenderSelector';
import Selector, {SelectorItemOnPressFn} from './components/Selector';
import BMRResultModal from './components/BMRResultModal';
import {activityLevels, goals} from './data/BMRData';

type Props = NavigationScreenProps;

type State = {
  loading: boolean;
  resultModalVisible: boolean;
  selectedGender: GenderType;
  heightValue: number;
  weightValue: number;
  ageValue: number;
  activeIndex: number;
  selectedActivityIndex: number;
  selectedGoalIndex: number;
  intakeResult: number;
  bmrResult: number;
};

export default class BMRCalculatorScene extends Component<Props, State> {
  state: State = {
    loading: false,
    resultModalVisible: false,
    selectedGender: 'male',
    heightValue: 175,
    weightValue: 92,
    ageValue: 22,
    activeIndex: 0,
    selectedActivityIndex: 0,
    selectedGoalIndex: 0,
    intakeResult: 0,
    bmrResult: 0,
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
      selectedActivityIndex,
      selectedGoalIndex,
      intakeResult,
    } = this.state;

    return (
      <View style={styles.root}>
        <Toolbar
          navigation={navigation}
          title="Calories"
          subtitle="Calculator"
        />
        <ScrollView
          ref={this._setScrollViewRef}
          horizontal={true}
          pagingEnabled={true}
          onMomentumScrollEnd={this._onScrollEnd}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        >
          <View style={styles.screenWidth}>
            <GenderSelector
              selectedGender={selectedGender}
              onItemPress={this._onGenderChange}
              containerStyle={{marginTop: 20}}
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

          <View style={styles.screenWidth}>
            <Text
              fontSize={MEDIUM_FONT_SIZE}
              style={{marginBottom: 20, textAlign: 'center'}}
            >
              Based on your activity level, which one of these described you the
              most?
            </Text>
            <Selector
              data={activityLevels}
              selectedIndex={selectedActivityIndex}
              onItemPress={this._onActivityLevelChange}
            />
          </View>

          <View style={styles.screenWidth}>
            <Text
              fontSize={MEDIUM_FONT_SIZE}
              style={{marginBottom: 20, textAlign: 'center'}}
            >
              What is your goal?
            </Text>
            <Selector
              data={goals}
              selectedIndex={selectedGoalIndex}
              onItemPress={this._onGoalChange}
            />
          </View>

          <BMRResultModal
            visible={resultModalVisible}
            burnoutResult={Number.parseInt(this._calcBurnout(), 10)}
            intakeResult={Number.parseInt(intakeResult.toFixed(0), 10)}
            onUpdatePress={this._navigateToDashboard}
            onRequestClose={this._toggleResultModal}
          />
        </ScrollView>

        {/* NAV BUTTON */}
        <View style={styles.footerContainer}>
          {activeIndex !== 2 ? (
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

  _onActivityLevelChange: SelectorItemOnPressFn = (index) => {
    this.setState({selectedActivityIndex: index});
  };
  _onGoalChange: SelectorItemOnPressFn = (index) => {
    this.setState({selectedGoalIndex: index});
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

    this.setState({intakeResult: this._calcIntake()});

    setTimeout(this._toggleResultModal, 1000);
  };
  _calcIntake = () => {
    let {
      selectedGender,
      weightValue,
      heightValue,
      ageValue,
      selectedActivityIndex,
      selectedGoalIndex,
    } = this.state;
    let bmrResult: number = 0;
    if (selectedGender === 'male') {
      bmrResult = 10 * weightValue + 6.25 * heightValue - 5 * ageValue + 5;
    } else if (selectedGender === 'female') {
      bmrResult = 10 * weightValue + 6.25 * heightValue - 5 * ageValue - 161;
    }
    this.setState({bmrResult});

    let intakeResult: number = 0;
    switch (activityLevels[selectedActivityIndex].title) {
      case 'sedentary':
        intakeResult = bmrResult * 1.2;
        break;
      case 'light':
        intakeResult = bmrResult * 1.375;
        break;
      case 'moderate':
        intakeResult = bmrResult * 1.55;
        break;
      case 'very':
        intakeResult = bmrResult * 1.725;
        break;
      case 'super':
        intakeResult = bmrResult * 1.9;
        break;
    }

    switch (goals[selectedGoalIndex].title) {
      case 'gain weight':
        intakeResult += 500;
        break;
    }
    return intakeResult;
  };
  _calcBurnout = () => {
    let {selectedGoalIndex, intakeResult, bmrResult} = this.state;

    let burnoutResult: number = 0;
    switch (goals[selectedGoalIndex].title) {
      case 'lose weight':
        burnoutResult = intakeResult - bmrResult + 500;
        break;
      case 'maintain weight':
        burnoutResult = intakeResult - bmrResult;
        break;
      case 'gain weight':
        burnoutResult = intakeResult - bmrResult - 500;
        break;
    }
    return burnoutResult.toFixed(0);
  };

  _toggleResultModal = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({
      resultModalVisible: !this.state.resultModalVisible,
      loading: false,
    });
  };
  _navigateToDashboard = () => {
    this.props.navigation.navigate('dashboardHome');
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
    let {activeIndex} = this.state;
    this._goToPage(activeIndex + 1);
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
  },
});
