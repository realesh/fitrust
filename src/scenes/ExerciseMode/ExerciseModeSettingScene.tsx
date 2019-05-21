import React, {Component} from 'react';
import {View, StyleSheet, LayoutAnimation, Image} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Text, Button} from '../../generals/core-ui';
import {
  BLUE,
  WHITE,
  LIGHTER_GREY,
  DARK_GREY70,
} from '../../generals/constants/colors';
import DurationChooser from './components/DurationChooser';
import {LinearGradient} from 'expo';
import {SCREEN_WIDTH, LARGE_FONT_SIZE} from '../../generals/constants/size';
import {Toolbar, PopupDialog} from '../../generals/components';
import IntensityChooser, {
  IntensityIndexEnum,
  Intensity,
} from './components/IntensityChooser';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import {intensitiesData, durationData} from './data/ExerciseModeDataFixtures';
import {exerciseReady} from '../../assets/images/exerciseMode';
import moment from 'moment';

type Props = NavigationScreenProps;

type State = {
  durationIndex: number;
  intensityIndex: 0 | 1 | 2 | 3;
  startModalVisible: boolean;
};

export type ExerciseSetting = {
  duration: number;
  intensity: Intensity;
};

export default class ExerciseModeSettingScene extends Component<Props, State> {
  state: State = {
    durationIndex: 0,
    intensityIndex: 0,
    startModalVisible: false,
  };

  render() {
    let {durationIndex, intensityIndex, startModalVisible} = this.state;

    let modalContent = `You are about to enter Exercise Mode in ${intensitiesData[
      intensityIndex
    ].title.toUpperCase()} zone for ${
      durationData[durationIndex]
    } MINS. Press start anytime once you're done doing your warm-up!`;

    return (
      <View style={styles.container}>
        <LinearGradient
          style={styles.durationContainer}
          colors={[BLUE, BLUE]}
          start={[0, 0.5]}
          end={[0.5, 0]}
        >
          <Toolbar
            navigation={this.props.navigation}
            containerStyle={{backgroundColor: 'transparent'}}
            fontColor={WHITE}
          />

          <Text
            style={styles.headerText}
            fontSize={LARGE_FONT_SIZE}
            fontWeight="bold"
          >
            What is your goal for this exercise?
          </Text>

          <DurationChooser
            durations={durationData}
            selectedDurationIndex={durationIndex}
            onDurationChange={this._onDurationChange}
            containerStyle={{marginTop: 10, marginBottom: 25}}
          />
        </LinearGradient>

        <View style={styles.bottomContainer}>
          <IntensityChooser
            intensities={intensitiesData}
            onValueChange={this._onIntensityChange}
            selectedIndex={intensityIndex}
          />
        </View>
        <View style={styles.footerContainer}>
          <Button
            style={styles.startButton}
            onPress={this._toggleStartModalVisible}
            // ADD DISABLED
          >
            Start
          </Button>
          <Text style={{color: DARK_GREY70}}>Chances left (2/2)</Text>
        </View>

        <PopupDialog
          visible={startModalVisible}
          onRequestClose={this._toggleStartModalVisible}
        >
          <Image
            source={exerciseReady}
            style={styles.image}
            resizeMode="contain"
          />
          <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
            Your exercise is ready!
          </Text>
          <Text style={{lineHeight: 24, textAlign: 'center', marginTop: 5}}>
            {modalContent}
          </Text>
          <Button
            onPress={this._navToCountdown}
            style={styles.interactButton}
            fontColor={BLUE}
          >
            START
          </Button>
        </PopupDialog>
      </View>
    );
  }

  _onDurationChange = (index: number) => {
    this.setState({durationIndex: index});
  };

  _onIntensityChange = (index: IntensityIndexEnum) => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({intensityIndex: index});
  };

  _toggleStartModalVisible = () => {
    this.setState({startModalVisible: !this.state.startModalVisible});
  };

  _navToCountdown = () => {
    let {durationIndex, intensityIndex} = this.state;
    let startMoment = moment();
    let exerciseSetting: ExerciseSetting = {
      duration: durationData[durationIndex],
      intensity: intensitiesData[intensityIndex],
    };
    this._toggleStartModalVisible();
    this.props.navigation.navigate('exerciseModeCountdown', {
      exerciseSetting,
      startMoment,
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  durationContainer: {
    alignItems: 'center',
    paddingBottom: 25,
  },
  bottomContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: LIGHTER_GREY,
  },
  headerText: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    color: WHITE,
  },
  subHeaderText: {
    color: WHITE,
    marginBottom: 10,
    marginLeft: 20,
  },
  footerContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  image: {
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
  startButton: {
    width: '100%',
    marginBottom: 5,
  },
});
