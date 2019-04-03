import React, {Component} from 'react';
import {View, StyleSheet, LayoutAnimation} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Text, Button} from '../../generals/core-ui';
import {BLUE, WHITE, LIGHTER_GREY} from '../../generals/constants/colors';
import DurationChooser from './components/DurationChooser';
import {LinearGradient} from 'expo';
import {SCREEN_WIDTH, LARGE_FONT_SIZE} from '../../generals/constants/size';
import {Toolbar} from '../../generals/components';
import IntensityChooser, {
  IntensityIndexEnum,
} from './components/IntensityChooser';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import {intensitiesData} from './data/ExerciseModeDataFixtures';

type Props = NavigationScreenProps;

type State = {
  durationIndex: number;
  intensityIndex: 0 | 1 | 2 | 3;
};

export default class ExerciseModeSettingScene extends Component<Props, State> {
  state: State = {
    durationIndex: 0,
    intensityIndex: 0,
  };

  render() {
    let {durationIndex, intensityIndex} = this.state;

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
            durations={[15, 30, 45, 60, 75, 90, 105, 120]}
            selectedDurationIndex={durationIndex}
            onDurationChange={this._onDurationChange}
            containerStyle={{marginTop: 15, marginBottom: 25}}
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
          <Button onPress={() => {}}>Start</Button>
        </View>
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
  },
});
