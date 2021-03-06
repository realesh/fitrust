import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Slider,
  LayoutAnimation,
  Image,
  AsyncStorage,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';

import {Text} from '../../generals/core-ui';
import {BIG_FONT_SIZE, MEDIUM_FONT_SIZE} from '../../generals/constants/size';
import {sliderThumb} from '../../assets/images/bmr';
import {WHITE, LIGHT_GREY, GREY, BLUE} from '../../generals/constants/colors';
import {Toolbar} from '../../generals/components';
import AnimatedButton from '../../generals/core-ui/AnimatedButton';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import ScalableItem from '../BMR/components/ScalableItem';
import {bmiCalc} from '../../assets/images/bmi';
import {bmiScaleList} from './data/BMIData';
import BMIResultModal from './components/BMIResultModal';
import {Mutation} from 'react-apollo';
import {
  CONNECT_BADGE,
  ConnectBadgeResponse,
  ConnectBadgeVariables,
} from '../../graphql/mutations/exerciseMode';
import {BADGESES} from '../../generals/constants/badgesList';
import BadgeModal from '../../generals/components/BadgeModal';
import {USER_PROFILE, BADGES_LIST} from '../../graphql/queries/profile';

type Props = NavigationScreenProps;

type State = {
  heightValue: number;
  weightValue: number;
  ageValue: number;
  loading: boolean;
  resultModalVisible: boolean;
  badgeModalVisible: boolean;
  badgePoints: number;
  badgeName: string;
  badgeUrl: string;

  bmiScaleIndex: number;
  bmiResult: number;
};

export default class BMICalculatorScene extends Component<Props, State> {
  state: State = {
    heightValue: 175,
    weightValue: 92,
    ageValue: 22,
    loading: false,
    resultModalVisible: false,
    badgeModalVisible: false,
    badgePoints: 0,
    badgeName: '',
    badgeUrl: '',
    bmiScaleIndex: 0,
    bmiResult: 0,
  };

  render() {
    let {navigation} = this.props;
    let {heightValue, weightValue, loading} = this.state;

    return (
      <View style={styles.root}>
        <Toolbar navigation={navigation} title="BMI" subtitle="Calculator" />
        <View style={styles.paddedContainer}>
          <Image source={bmiCalc} style={styles.image} resizeMode="contain" />
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
              style={{width: '80%'}}
            />
          </View>

          <View style={styles.rowContainer}>
            <ScalableItem
              title="Weight"
              value={weightValue}
              onMinusPress={this._onWeightMinus}
              onPlusPress={this._onWeightPlus}
            />
          </View>
        </View>
        <View style={styles.footerContainer}>
          <AnimatedButton onPress={this._onCalcPress} loading={loading}>
            Calculate
          </AnimatedButton>
        </View>

        {this._renderResultModal()}
        <BadgeModal
          visible={this.state.badgeModalVisible}
          pointsValue={this.state.badgePoints}
          name={this.state.badgeName}
          imageUrl={this.state.badgeUrl}
          onRequestClose={this._closeBadgeModal}
        />
      </View>
    );
  }

  _onHeightChange = (value: number) =>
    this.setState({heightValue: Math.floor(value)});
  _onWeightPlus = () =>
    this.setState({weightValue: this.state.weightValue + 1});
  _onWeightMinus = () =>
    this.setState({weightValue: this.state.weightValue - 1});

  _onCalcPress = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({loading: true});

    let {heightValue, weightValue} = this.state;
    let meterHeight = Math.pow(heightValue / 100, 2);
    let bmiResult = Number.parseInt((weightValue / meterHeight).toFixed(0), 10);

    let bmiScaleIndex = bmiScaleList.findIndex(
      (bmiScale) => bmiResult >= bmiScale.min && bmiResult <= bmiScale.max,
    );

    this.setState({bmiResult, bmiScaleIndex});

    setTimeout(this._toggleResultModal, 1000);
  };

  _toggleResultModal = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({
      resultModalVisible: !this.state.resultModalVisible,
      loading: false,
    });
  };

  _renderResultModal = () => (
    <Mutation<ConnectBadgeResponse, ConnectBadgeVariables>
      mutation={CONNECT_BADGE}
    >
      {(connectBadge, {data, loading}) => {
        let {
          badgeModalVisible,
          resultModalVisible,
          bmiResult,
          bmiScaleIndex,
        } = this.state;
        let handleConnect = async () => {
          try {
            let ID = await AsyncStorage.getItem('userID');
            connectBadge &&
              (await connectBadge({
                variables: {
                  userID: ID || '',
                  badgeID: BADGESES.bmiFirst,
                },
                refetchQueries: [
                  {
                    query: USER_PROFILE,
                    variables: {
                      userID: ID,
                    },
                  },
                  {
                    query: BADGES_LIST,
                    variables: {
                      userID: ID,
                    },
                  },
                ],
              }));
          } catch (error) {
            // Handle Error
          }
        };
        if (
          !loading &&
          data &&
          data.connectBadges &&
          data.connectBadges.statusCode === 200 &&
          !badgeModalVisible
        ) {
          this.setState({
            badgeModalVisible: true,
            badgeName: data.connectBadges.name,
            badgePoints: data.connectBadges.badgePoints,
            badgeUrl: data.connectBadges.imageUrl,
          });
        }
        if (
          !loading &&
          data &&
          data.connectBadges &&
          data.connectBadges.statusCode === 409
        ) {
          this.props.navigation.goBack();
        }

        return (
          <BMIResultModal
            visible={resultModalVisible}
            onRequestClose={this._toggleResultModal}
            bmiResult={bmiResult}
            bmiScaleIndex={bmiScaleIndex}
            onUpdatePress={handleConnect}
          />
        );
      }}
    </Mutation>
  );

  _closeBadgeModal = () => {
    this.props.navigation.goBack();
    // this.setState({badgeModalVisible: false});
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
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '50%',
  },
  image: {
    height: 200,
    width: '100%',
  },
  heightContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
