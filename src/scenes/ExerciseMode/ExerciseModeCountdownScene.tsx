import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  LayoutAnimation,
  Image,
  BackHandler,
  AsyncStorage,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import CountDown from 'react-native-countdown-component';
import {Text, Button} from '../../generals/core-ui';
import {
  LARGE_FONT_SIZE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../generals/constants/size';
import {BLUE, WHITE, BLACK30} from '../../generals/constants/colors';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import {exerciseMode, exerciseReady} from '../../assets/images/exerciseMode';
import {ExerciseSetting} from './ExerciseModeSettingScene';
import {Moment} from 'moment';
import {PopupDialog} from '../../generals/components';
import {
  UPDATE_COUPONS,
  UpdateCouponResponse,
  UpdateCouponVariables,
  ExerciseTypeEnum,
} from '../../graphql/mutations/exerciseMode';
import {Mutation} from 'react-apollo';
import moment from 'moment';

type NavigationParams = {
  exerciseSetting: ExerciseSetting;
  startMoment: Moment;
  mhr: number;
};

type Props = NavigationScreenProps<NavigationParams>;

type State = {
  runningCount: boolean;
  finishModalVisible: boolean;
};

export default class ExerciseModeCountdownScene extends Component<
  Props,
  State
> {
  state = {
    runningCount: false,
    finishModalVisible: false,
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  render() {
    let {runningCount} = this.state;
    let {duration, intensity} = this.props.navigation.getParam(
      'exerciseSetting',
    );
    let mhr = this.props.navigation.getParam('mhr');

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.paddedContainer,
            {left: runningCount ? 0 : -SCREEN_WIDTH},
          ]}
        >
          <Text fontSize={25} fontWeight="bold" style={[styles.headerText]}>
            {`Exercise Mode - ${intensity.title}`}
          </Text>

          <View
            style={{
              borderRadius: 10,
              backgroundColor: BLACK30,
              padding: 15,
              marginTop: 15,
              width: '100%',
            }}
          >
            <Image
              source={exerciseMode}
              style={styles.image}
              resizeMode="contain"
            />
            <Text fontWeight="light" style={{color: WHITE, lineHeight: 25}}>
              Manage your heartbeat between{'\n'}
              <Text fontWeight="bold">{`${(intensity.min * mhr).toFixed(0)}-${(
                intensity.max * mhr
              ).toFixed(0)} BPM`}</Text>{' '}
              to get the best out of your goals!
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.fillStyle,
            {left: runningCount ? -SCREEN_WIDTH * 2 : 0},
          ]}
        >
          <Text
            fontSize={LARGE_FONT_SIZE}
            style={{marginBottom: 10, color: WHITE}}
          >
            Your exercise will start in
          </Text>
          <CountDown
            until={5}
            timeToShow={['S']}
            onFinish={this._onInitialCountdownFinish}
            size={70}
            timeLabels={{s: ''}}
            showSeparator={true}
            digitTxtStyle={{fontFamily: 'Lato-Bold', color: WHITE}}
            digitStyle={{
              backgroundColor: 'transparent',
            }}
          />
        </View>
        <View
          style={[styles.countContainer, {bottom: runningCount ? 0 : -300}]}
        >
          <CountDown
            until={duration * 60}
            // until={5}
            timeToShow={['H', 'M', 'S']}
            onFinish={this._onCountdownFinish}
            size={50}
            timeLabels={{h: '', m: '', s: ''}}
            showSeparator={true}
            separatorStyle={{
              paddingHorizontal: 10,
              fontFamily: 'Lato-Bold',
              color: BLUE,
              marginBottom: 10,
            }}
            timeLabelStyle={{color: BLUE}}
            digitTxtStyle={{fontFamily: 'Lato-Bold', color: BLUE}}
            digitStyle={{
              backgroundColor: 'transparent',
            }}
            running={runningCount}
          />
        </View>
        {this._renderPopup(duration, intensity.title)}
      </View>
    );
  }

  handleBackButton() {
    alert('hey');
    return true;
  }

  _onInitialCountdownFinish = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({runningCount: true});
  };

  _toggleResultModalVisible = () => {
    this.setState({finishModalVisible: !this.state.finishModalVisible});
  };

  _onCountdownFinish = () => {
    this._toggleResultModalVisible();
  };

  _renderPopup = (duration: number, type: ExerciseTypeEnum) => (
    <Mutation<UpdateCouponResponse, UpdateCouponVariables>
      mutation={UPDATE_COUPONS}
    >
      {(updateCoupons) => {
        let startTime = '';
        let finishTime = '';
        let date = '';

        let handleUpdate = async () => {
          let startMoment = this.props.navigation
            .getParam('startMoment')
            .add(1, 'minutes');
          let formatTime = (time: number) => {
            if (time < 10) {
              return `0${time}`;
            } else {
              return String(time);
            }
          };
          startTime = `${formatTime(startMoment.get('hours'))}:${formatTime(
            startMoment.get('minutes'),
          )}`;
          let finishMoment = startMoment.add(duration - 1, 'minutes');
          finishTime = `${formatTime(finishMoment.get('hours'))}:${formatTime(
            finishMoment.get('minutes'),
          )}`;

          let dateMoment = moment();
          date = [
            dateMoment.get('year'),
            dateMoment.get('month') + 1 < 10
              ? '0' + (dateMoment.get('month') + 1)
              : dateMoment.get('month') + 1,
            dateMoment.get('date') < 10
              ? '0' + dateMoment.get('date')
              : dateMoment.get('date'),
          ].join('-');

          try {
            let ID = await AsyncStorage.getItem('userID');
            updateCoupons &&
              (await updateCoupons({
                variables: {
                  userID: ID || '',
                  duration,
                  type,
                  startTime,
                  finishTime,
                  date,
                },
              }));
          } catch (error) {
            // Handle Error
          }
          this._toggleResultModalVisible();
          this.props.navigation.navigate('dashboardHome');
        };
        return (
          <PopupDialog visible={this.state.finishModalVisible}>
            <Image
              source={exerciseReady}
              style={styles.finishImage}
              resizeMode="contain"
            />
            <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
              Coupon earned!
            </Text>
            <Text style={{lineHeight: 24, textAlign: 'center', marginTop: 5}}>
              Redeem your earned coupon later for points when your data has
              completely processed!
            </Text>
            <Button
              onPress={handleUpdate}
              style={styles.interactButton}
              fontColor={BLUE}
            >
              CLAIM
            </Button>
          </PopupDialog>
        );
      }}
    </Mutation>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE,
  },
  paddedContainer: {
    paddingHorizontal: 20,
    position: 'absolute',
    width: '100%',
  },
  headerText: {
    marginTop: 100,
    color: WHITE,
    alignSelf: 'center',
  },
  circleStyle: {
    height: SCREEN_HEIGHT * 2,
    width: SCREEN_WIDTH * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fillStyle: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    height: 200,
    width: '100%',
    marginTop: 10,
  },
  finishImage: {
    height: 250,
    width: '100%',
  },
  interactButton: {
    backgroundColor: WHITE,
    marginTop: 20,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BLUE,
    width: '90%',
  },
});
