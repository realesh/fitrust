import React, {Component} from 'react';
import {View, StyleSheet, Slider, LayoutAnimation} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';

import {Text} from '../../generals/core-ui';
import {BIG_FONT_SIZE, MEDIUM_FONT_SIZE} from '../../generals/constants/size';
import {
  maleActive,
  femaleActive,
  maleInactive,
  femaleInactive,
  sliderThumb,
} from '../../assets/images/bmr';
import {
  WHITE,
  LIGHT_GREY,
  GREY,
  BLUE,
  LIGHTER_GREY,
} from '../../generals/constants/colors';
import {Toolbar} from '../../generals/components';
import GenderItem from './GenderItem';
import ScalableItem from './ScalableItem';
import AnimatedButton from '../../generals/core-ui/AnimatedButton';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import PopupDialog from '../../generals/components/PopupDialog';

type Props = NavigationScreenProps;

type State = {
  selectedGender: 'male' | 'female';
  heightValue: number;
  weightValue: number;
  ageValue: number;
  loading: boolean;
  resultModalVisible: boolean;
};

export default class BMRCalculatorScene extends Component<Props, State> {
  state: State = {
    selectedGender: 'male',
    heightValue: 175,
    weightValue: 92,
    ageValue: 22,
    loading: false,
    resultModalVisible: false,
  };

  render() {
    let {navigation} = this.props;
    let {
      heightValue,
      weightValue,
      ageValue,
      loading,
      resultModalVisible,
    } = this.state;

    return (
      <View style={styles.root}>
        <Toolbar navigation={navigation} title="BMR Calculator" />
        <View style={styles.paddedContainer}>
          <View style={styles.rowContainer}>
            <GenderItem
              onPress={this._setGenderToMale}
              style={[
                this._checkActive('male', 'container'),
                {marginRight: 10},
              ]}
              imageSource={this._checkActive('male', 'image')}
              text="Male"
            />
            <GenderItem
              onPress={this._setGenderToFemale}
              style={[
                this._checkActive('female', 'container'),
                {marginLeft: 10},
              ]}
              imageSource={this._checkActive('female', 'image')}
              text="Female"
            />
          </View>

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
        <View style={styles.footerContainer}>
          <AnimatedButton onPress={this._onCalcPress} loading={loading}>
            Calculate
          </AnimatedButton>
        </View>

        <PopupDialog
          visible={resultModalVisible}
          title="Your BMR"
          message="Lorem Ipsum"
          onRequestClose={this._toggleResultModal}
          buttonTitle="Got it"
          buttonOnPress={this._toggleResultModal}
        />
      </View>
    );
  }

  _checkActive = (gender: 'male' | 'female', type: 'image' | 'container') => {
    if (gender === 'male') {
      if (type === 'image') {
        return this.state.selectedGender === 'male' ? maleActive : maleInactive;
      } else if (type === 'container') {
        return this.state.selectedGender === 'male'
          ? styles.activeGenderContainerStyle
          : styles.inactiveGenderContainerStyle;
      }
    } else if (gender === 'female') {
      if (type === 'image') {
        return this.state.selectedGender === 'female'
          ? femaleActive
          : femaleInactive;
      } else if (type === 'container') {
        return this.state.selectedGender === 'female'
          ? styles.activeGenderContainerStyle
          : styles.inactiveGenderContainerStyle;
      }
    }
  };

  _setGenderToMale = () => this.setState({selectedGender: 'male'});
  _setGenderToFemale = () => this.setState({selectedGender: 'female'});

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
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
});
