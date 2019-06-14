import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Swiper} from '../../generals/components';
import OnBoardingItem from './OnBoardingItem';
import {
  fitnessTracker,
  personalTrainer,
  hero,
  largeBurger,
  celebration,
} from '../../assets/images/onBoarding';
import {NavigationScreenProp} from 'react-navigation';

type Props = {
  navigation: NavigationScreenProp<any, any>;
};

let welcomeContent =
  'Hey! First time here?\n' +
  'Fitrust is an app designed to track your daily health lifestyle with a lot of fun!\n' +
  'Here you can complete missions, do tracked exercise, and compete with your friends.\n';
let heroContent =
  'Here, you can earn badges and titles for what you do, and even save the world!\n' +
  'Why saving the world you ask?\n' +
  'Well because we have a problem...';
let monsterContent =
  'Our world have been invaded by some bad aliens!\n' +
  'They had contaminated our air that made our food so big that it becames hard to eat :(\n' +
  'So help us to clear the air!';
let solutionContent =
  'How? Luckily you are the answer!\n' +
  'Your body produce a lot of sweat during exercises,\n' +
  'and the body odor cleans the air off the aliens pollution!\n' +
  "No it's not filthy, it's healthy!";
let startContent =
  'So what are you waiting for?\n' +
  'Start using Fitrust and be the #1 Hero of all!\n' +
  'We wish you the best of luck!';

export default class OnBoardingScene extends Component<Props, {}> {
  render() {
    return (
      <View style={styles.root}>
        <Swiper onFinish={this._navigateToAuth}>
          <OnBoardingItem
            title="Welcome to Fitrust!"
            content={welcomeContent}
            image={fitnessTracker}
          />
          <OnBoardingItem
            title="Be the Hero!"
            content={heroContent}
            image={hero}
          />
          <OnBoardingItem
            title="Monstrous Food!"
            content={monsterContent}
            image={largeBurger}
          />
          <OnBoardingItem
            title="Get Sweaty!"
            content={solutionContent}
            image={personalTrainer}
          />
          <OnBoardingItem
            title="Let's Go!"
            content={startContent}
            image={celebration}
          />
        </Swiper>
      </View>
    );
  }

  _navigateToAuth = () => {
    let {navigation} = this.props;
    navigation.navigate('authField', {previous_scene: 'OnBoarding'});
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
