import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Animated} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Text} from '../../generals/core-ui';
import {
  MEDIUM_FONT_SIZE,
  HEADER_FONT_SIZE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../generals/constants/size';
import {
  BLUE,
  LIGHTER_GREY,
  LIGHT_GREY,
  WHITE,
} from '../../generals/constants/colors';
import {ProgressWithLabel, Toolbar} from '../../generals/components';
import {food, fire} from '../../assets/images/dashboard';
import CaloriesInfo from './CaloriesInfo';
import AnimatedChevron from '../../generals/components/AnimatedChevron';

type Props = NavigationScreenProps;

export default class DashboardScene extends Component<Props> {
  state = {
    fadeInAnimatedValue: new Animated.Value(0),
  };

  componentDidMount() {
    let {fadeInAnimatedValue} = this.state;
    Animated.timing(fadeInAnimatedValue, {
      toValue: 1,
      duration: 500,
    }).start();
  }

  render() {
    let {fadeInAnimatedValue} = this.state;
    let {navigation} = this.props;

    let overlayStyle = {
      opacity: fadeInAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
      zIndex: 10,
      position: 'absolute',
      top: 80,
      backgroundColor: WHITE,
    };

    return (
      <ScrollView
        contentContainerStyle={styles.root}
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
      >
        <Animated.View style={overlayStyle} pointerEvents="none" />

        <View style={styles.scrollHeight}>
          <Toolbar navigation={navigation} />
          <View style={styles.paddedContainer}>
            <Text fontWeight="regular" fontSize={MEDIUM_FONT_SIZE}>
              Hello, Sandro.
            </Text>
            <Text
              fontWeight="bold"
              fontSize={HEADER_FONT_SIZE}
              style={{marginBottom: 15}}
            >
              Today's looking
              <Text
                fontWeight="bold"
                fontSize={HEADER_FONT_SIZE}
                style={{color: BLUE}}
              >
                {' '}
                great!
              </Text>
            </Text>
          </View>
          <View style={[styles.paddedContainer, styles.contentContainer]}>
            <View style={styles.boxShadow}>
              <Text fontWeight="bold" style={{marginBottom: 20}}>
                Daily Goals.
              </Text>
              <ProgressWithLabel
                label="Steps"
                currentValue={3000}
                maxValue={5000}
                unit="steps"
                containerStyle={{marginBottom: 25}}
              />
              <ProgressWithLabel
                label="Drink water"
                currentValue={450}
                maxValue={3000}
                unit="mL"
                editable={true}
              />
            </View>

            <View style={styles.boxShadow}>
              <View style={styles.calLabelContainer}>
                <Text fontWeight="bold">Calories.</Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <CaloriesInfo
                  image={food}
                  currentValue={1700}
                  maxValue={2324}
                  buttonTitle="INTAKE"
                />
                <CaloriesInfo
                  image={fire}
                  currentValue={130}
                  maxValue={430}
                  buttonTitle="WORKOUT"
                />
              </View>
            </View>
          </View>
          <AnimatedChevron />
        </View>
        <View style={styles.scrollHeight} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
  },
  paddedContainer: {
    paddingHorizontal: 20,
    backgroundColor: WHITE,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: LIGHTER_GREY,
    borderTopWidth: 1,
    borderColor: LIGHT_GREY,
  },
  boxShadow: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
  },
  calLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scrollHeight: {
    height: SCREEN_HEIGHT - 70,
    backgroundColor: LIGHTER_GREY,
  },
});
