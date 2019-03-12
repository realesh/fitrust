import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Swiper} from '../../generals/components';
import OnBoardingItem from './OnBoardingItem';
import {
  fitnessTracker,
  heartRateDoctor,
  personalTrainer,
} from '../../assets/images/onBoarding';
import {NavigationScreenProp} from 'react-navigation';

type Props = {
  navigation: NavigationScreenProp<any, any>;
};

export default class OnBoardingScene extends Component<Props, {}> {
  render() {
    return (
      <View style={styles.root}>
        <Swiper onFinish={this._navigateToAuth}>
          <OnBoardingItem
            title="Fitness Tracker"
            content="Lorem ipsum"
            image={fitnessTracker}
          />
          <OnBoardingItem
            title="Max Heart Rate"
            content="Lorem ipsum"
            image={heartRateDoctor}
          />
          <OnBoardingItem
            title="Personal Trainer"
            content="Lorem ipsum"
            image={personalTrainer}
          />
        </Swiper>
      </View>
    );
  }

  _navigateToAuth = () => {
    let {navigation} = this.props;
    navigation.navigate('Auth', {previous_scene: 'OnBoarding'});
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  paddedContainer: {
    paddingHorizontal: 20,
  },
  image: {marginBottom: 10, width: 180, height: 48},
});
