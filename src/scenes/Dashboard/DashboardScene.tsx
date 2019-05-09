import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  AsyncStorage,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Text, Button} from '../../generals/core-ui';
import {
  MEDIUM_FONT_SIZE,
  HEADER_FONT_SIZE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  LARGE_FONT_SIZE,
} from '../../generals/constants/size';
import {
  BLUE,
  LIGHTER_GREY,
  LIGHT_GREY,
  WHITE,
  GREY,
} from '../../generals/constants/colors';
import {
  ProgressWithLabel,
  Toolbar,
  PopupInfoDialog,
  PointsModal,
} from '../../generals/components';
import {food, fire} from '../../assets/images/dashboard';
import CaloriesInfo from './CaloriesInfo';
import AnimatedChevron from '../../generals/components/AnimatedChevron';
import StepsChartPage from './StepsChartPage';
import DrinkWaterModal from './components/DrinkWaterModal';

type NavigationScreenParams = {
  name: string;
  token: string;
};

type Props = NavigationScreenProps<NavigationScreenParams>;

type State = {
  fadeInAnimatedValue: Animated.Value;
  bmrModalVisible: boolean;
  waterModalVisible: boolean;
  waterValue: number;
  stepGoalClaimed: boolean;
  waterGoalClaimed: boolean;
  stepClaimModalVisible: boolean;
  waterClaimModalVisible: boolean;
};

export default class DashboardScene extends Component<Props, State> {
  state = {
    fadeInAnimatedValue: new Animated.Value(0),
    bmrModalVisible: false,
    waterModalVisible: false,
    waterValue: 0,
    stepGoalClaimed: false,
    waterGoalClaimed: false,
    stepClaimModalVisible: false,
    waterClaimModalVisible: false,
  };

  componentDidMount() {
    let {fadeInAnimatedValue} = this.state;
    Animated.timing(fadeInAnimatedValue, {
      toValue: 1,
      duration: 500,
    }).start();

    let token = this.props.navigation.getParam('token');
    this._storeToken(token);
  }

  _storeToken = async (token: string) => {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      // Handle ERROR
    }
  };

  render() {
    let {
      fadeInAnimatedValue,
      bmrModalVisible,
      waterModalVisible,
      waterValue,
      stepGoalClaimed,
      waterGoalClaimed,
      stepClaimModalVisible,
      waterClaimModalVisible,
    } = this.state;
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

    const BMRMessage =
      'These numbers are the amount of cals that is determined by your ' +
      'BMR and TDEE, and is reccommended for you to fulfill.  ' +
      'Recalculate your BMR and TDEE every month to maintain the accuracy.';

    return (
      <ScrollView
        contentContainerStyle={styles.root}
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
        bounces={false}
      >
        <Animated.View style={overlayStyle} pointerEvents="none" />

        <View style={styles.scrollHeight}>
          <Toolbar navigation={navigation} pointsInfo={true} />
          <View style={styles.paddedContainer}>
            <Text fontWeight="regular" fontSize={MEDIUM_FONT_SIZE}>
              {`Hello, ${name}.`}
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
                currentValue={5000}
                maxValue={5000}
                unit="steps"
                containerStyle={{marginBottom: 25}}
                iconName="refresh-cw"
                onIconPress={() => {}}
                isClaimed={stepGoalClaimed}
                onClaimPress={this._onStepGoalClaim}
              />
              <ProgressWithLabel
                label="Drink water"
                currentValue={waterValue}
                maxValue={8}
                unit="glass"
                iconName="plus-square"
                onIconPress={this._toggleWaterModal}
                isClaimed={waterGoalClaimed}
                onClaimPress={this._onWaterGoalClaim}
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

              <Button
                iconName="more-horizontal"
                style={styles.optionsButton}
                fontColor={GREY}
                fontSize={LARGE_FONT_SIZE}
                onPress={this._toggleBMRModal}
              />

              <PopupInfoDialog
                visible={bmrModalVisible}
                title="Calories"
                message={BMRMessage}
                onRequestClose={this._toggleBMRModal}
                buttonTitle="Recalculate"
                buttonOnPress={this._goToBMR}
              />
            </View>
          </View>
          <AnimatedChevron />
        </View>
        <View style={styles.scrollHeight}>
          <StepsChartPage />
        </View>

        <DrinkWaterModal
          visible={waterModalVisible}
          onAddPress={this._onAddWater}
        />
        <PointsModal
          visible={stepClaimModalVisible}
          pointsSource="Daily Goal - Step"
          pointsValue={9200}
          onRequestClose={this._toggleStepClaimModalVisible}
        />
        <PointsModal
          visible={waterClaimModalVisible}
          pointsSource="Daily Goal - Drink Water"
          pointsValue={800}
          onRequestClose={this._toggleWaterClaimModalVisible}
        />
      </ScrollView>
    );
  }

  _toggleBMRModal = () => {
    this.setState({bmrModalVisible: !this.state.bmrModalVisible});
  };
  _toggleWaterModal = () => {
    this.setState({waterModalVisible: !this.state.waterModalVisible});
  };
  _goToBMR = () => {
    let {navigation} = this.props;
    this.setState({bmrModalVisible: false});
    navigation.navigate('BMRCalculator', {previous_scene: 'Home'});
  };
  _onAddWater = (value: number) => {
    this.setState({waterValue: this.state.waterValue + value});
    this._toggleWaterModal();
  };
  _onStepGoalClaim = () => {
    this.setState({stepGoalClaimed: true});
    this._toggleStepClaimModalVisible();
  };
  _onWaterGoalClaim = () => {
    this.setState({waterGoalClaimed: true});
    this._toggleWaterClaimModalVisible();
  };
  _toggleStepClaimModalVisible = () => {
    this.setState({stepClaimModalVisible: !this.state.stepClaimModalVisible});
  };
  _toggleWaterClaimModalVisible = () => {
    this.setState({waterClaimModalVisible: !this.state.waterClaimModalVisible});
  };
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
    height: SCREEN_HEIGHT - 65,
    backgroundColor: LIGHTER_GREY,
  },
  optionsButton: {
    position: 'absolute',
    alignItems: 'center',
    right: 20,
    top: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
});
