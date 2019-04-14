import React, {Component} from 'react';
import {View, StyleSheet, LayoutAnimation, Image} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import CountDown from 'react-native-countdown-component';
import {Text} from '../../generals/core-ui';
import {
  LARGE_FONT_SIZE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../generals/constants/size';
import {BLUE, WHITE, BLACK30} from '../../generals/constants/colors';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import {exerciseMode} from '../../assets/images/exerciseMode';
import {ExerciseSetting} from './ExerciseModeSettingScene';

type NavigationParams = {
  exerciseSetting: ExerciseSetting;
};

type Props = NavigationScreenProps<NavigationParams>;

type State = {
  finishModalVisible: boolean;
  runningCount: boolean;
};

export default class ExerciseModeCountdownScene extends Component<
  Props,
  State
> {
  state = {
    finishModalVisible: false,
    runningCount: false,
  };

  render() {
    let {finishModalVisible, runningCount} = this.state;
    let {duration, intensity} = this.props.navigation.getParam(
      'exerciseSetting',
    );

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
              <Text fontWeight="bold">{`${intensity.min}-${
                intensity.max
              } BPM`}</Text>{' '}
              to get the best out of your goals!
            </Text>
          </View>
        </View>

        <View
          style={[styles.fillStyle, {right: runningCount ? SCREEN_WIDTH : 0}]}
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
            timeToShow={['H', 'M', 'S']}
            onFinish={this._onCountdownFinish}
            size={50}
            timeLabels={{h: '', m: '', s: ''}}
            showSeparator={true}
            separatorStyle={{
              paddingHorizontal: 10,
              fontFamily: 'Lato-Bold',
              color: BLUE,
            }}
            timeLabelStyle={{color: BLUE}}
            digitTxtStyle={{fontFamily: 'Lato-Bold', color: BLUE}}
            digitStyle={{
              backgroundColor: 'transparent',
            }}
            running={runningCount}
          />
        </View>
      </View>
    );
  }

  _onInitialCountdownFinish = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({runningCount: true});
  };

  _onCountdownFinish = () => {
    alert('yey');
  };
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
});
