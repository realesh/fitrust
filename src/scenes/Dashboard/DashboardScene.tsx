import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  AsyncStorage,
  ActivityIndicator,
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
import {Query, Mutation} from 'react-apollo';
import {
  UserDashboardResponse,
  UserDashboardVariables,
  USER_DASHBOARD,
  UserDashboardData,
  RESET_DAILY_GOAL,
  ResetDailyResponse,
  ResetDailyVariables,
} from '../../graphql/queries/dashboard';
import {DEFAULT_USER_DASHBOARD} from './data/dashboardData';
import LockedScene from '../LockedScene';
import LockedProgressGoal from '../../generals/components/LockedProgressGoal';
import fetchTodayActivities, {
  DEFAULT_ACTIVITIES_SUMMARY,
  TodayActivitiesResponseSummary,
} from '../../helpers/Fetchers/fetchTodayActivities';

export type UpdateFitbitAuthFn = (
  fitbitUserID: string,
  fitbitAccessToken: string,
) => void;

type NavigationScreenParams = {
  id: string;
  name: string;
  token: string;
};

type State = {
  isChecked: boolean;
};

type Props = NavigationScreenProps<NavigationScreenParams>;

type BaseProps = Props & {
  resetDailyFunc: (userID: string, resetValue: number) => Promise<void>;
  // resetDailyFunc: MutationFn<ResetDailyResponse, ResetDailyVariables>;
};

type BaseState = TodayActivitiesResponseSummary & {
  fadeInAnimatedValue: Animated.Value;
  bmrModalVisible: boolean;
  waterModalVisible: boolean;
  waterValue: number;
  stepGoalClaimed: boolean;
  waterGoalClaimed: boolean;
  stepClaimModalVisible: boolean;
  waterClaimModalVisible: boolean;
  userDisplayName: string;
  fitbitUserID: string;
  fitbitAccessToken: string;
  fetchFitbitLoading: boolean;
};
export default class DashboardScene extends Component<Props, State> {
  render() {
    return (
      <Mutation<ResetDailyResponse, ResetDailyVariables>
        mutation={RESET_DAILY_GOAL}
      >
        {(resetDailyFn) => {
          let resetDaily = async (userID: string, resetValue: number) => {
            await resetDailyFn({
              variables: {
                userID,
                resetValue,
              },
              refetchQueries: [
                {
                  query: USER_DASHBOARD,
                  variables: {
                    userID,
                  },
                },
              ],
            });
            // TODO: reset all daily cache
          };
          return (
            <DashboardSceneBase
              navigation={this.props.navigation}
              resetDailyFunc={resetDaily}
            />
          );
        }}
      </Mutation>
    );
  }
}

class DashboardSceneBase extends Component<BaseProps, BaseState> {
  state = {
    fadeInAnimatedValue: new Animated.Value(0),
    bmrModalVisible: false,
    waterModalVisible: false,
    waterValue: 0,
    stepGoalClaimed: false,
    waterGoalClaimed: false,
    stepClaimModalVisible: false,
    waterClaimModalVisible: false,
    userDisplayName: '',
    fitbitUserID: '',
    fitbitAccessToken: '',
    fetchFitbitLoading: true,
    ...DEFAULT_ACTIVITIES_SUMMARY,
  };

  componentDidMount() {
    let {fadeInAnimatedValue} = this.state;
    Animated.timing(fadeInAnimatedValue, {
      toValue: 1,
      duration: 500,
    }).start();

    let name = this.props.navigation.getParam('name', '');
    if (name) {
      this.setState({userDisplayName: name});
    }
    this._storeToken();
    this._setSkipOnBoard();
    this._storeID();
    this._getFitbitAuth();
  }

  _storeToken = async () => {
    try {
      let token = this.props.navigation.getParam('token');
      if (token) {
        await AsyncStorage.setItem('userToken', token);
      }
    } catch (error) {
      // Handle ERROR
    }
  };
  _setSkipOnBoard = async () => {
    try {
      let skipOnBoard = await AsyncStorage.getItem('skipOnBoard');
      if (!skipOnBoard) {
        await AsyncStorage.setItem('skipOnBoard', 'skip');
      }
    } catch (error) {
      // Handle ERROR
    }
  };
  _storeID = async () => {
    try {
      let id = this.props.navigation.getParam('id', '');
      if (id) {
        await AsyncStorage.setItem('userID', id);
      }
    } catch (error) {
      // Handle ERROR
    }
  };
  _getFitbitAuth = async () => {
    try {
      let fitbitUserID = await AsyncStorage.getItem('fitbit_user_id');
      let fitbitAccessToken = await AsyncStorage.getItem('fitbit_access_token');
      if (!fitbitUserID || !fitbitAccessToken) {
        this.props.navigation.navigate('fitbitAuth', {
          previous_scene: 'Dashboard',
          updateFunc: this._updateFitbitAuth,
        });
        this.setState({fetchFitbitLoading: false});
      } else {
        this.setState({fitbitUserID, fitbitAccessToken});
        this._fetchStepInfo();
      }
    } catch (error) {
      // Handle ERROR
    }
  };
  _fetchStepInfo = async () => {
    let fitbitUserID = await AsyncStorage.getItem('fitbit_user_id');
    let fitbitAccessToken = await AsyncStorage.getItem('fitbit_access_token');
    if (fitbitUserID && fitbitAccessToken) {
      let fitbitResponse = await fetchTodayActivities(
        fitbitUserID,
        fitbitAccessToken,
      );
      let {steps, floors, distances, caloriesBMR} = fitbitResponse.summary;
      this.setState({
        steps,
        floors,
        distances,
        caloriesBMR,
        fetchFitbitLoading: false,
      });
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
      fitbitUserID,
      fitbitAccessToken,
      fetchFitbitLoading,
      steps,
      caloriesBMR,
      floors,
      distances,
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
      <Query<UserDashboardResponse, UserDashboardVariables>
        query={USER_DASHBOARD}
        variables={{userID: navigation.getParam('id')}}
      >
        {({data, loading}) => {
          let result: UserDashboardData =
            (data && data.user && data.user.profile) || DEFAULT_USER_DASHBOARD;
          let todayDate = new Date().getDate();
          let lastUpdatedDate = new Date(result.updatedAt).getDate();

          if (todayDate !== lastUpdatedDate && !loading) {
            this.props.resetDailyFunc(navigation.getParam('id', ''), 0);
          }

          let goToSearchFood = () => {
            navigation.navigate('foodSearch', {
              previous_scene: 'Home',
              currCals: result.intakeValue,
            });
          };
          let goToSearchWorkout = () => {
            navigation.navigate('workoutSearch', {
              previous_scene: 'Home',
              currCals: result.workoutValue,
            });
          };

          let goToCouponList = async () => {
            let userID = await AsyncStorage.getItem('userID');
            navigation.navigate('exCouponList', {
              userID,
              fitbitUserID,
              fitbitAccessToken,
              previous_scene: 'Home',
            });
          };

          return (
            <ScrollView
              contentContainerStyle={styles.root}
              showsVerticalScrollIndicator={false}
              pagingEnabled={true}
              bounces={false}
            >
              <Animated.View style={overlayStyle} pointerEvents="none" />

              <View style={styles.scrollHeight}>
                <Toolbar
                  navigation={navigation}
                  points={loading ? '' : result.points.toString()}
                  onPointsClick={goToCouponList}
                />
                <View style={styles.paddedContainer}>
                  <Text fontWeight="regular" fontSize={MEDIUM_FONT_SIZE}>
                    {`Hello, ${result.name || this.state.userDisplayName}.`}
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
                {loading || fetchFitbitLoading ? (
                  <View
                    style={[styles.paddedContainer, styles.contentContainer]}
                  >
                    <ActivityIndicator color={BLUE} size="large" />
                  </View>
                ) : (
                  <View
                    style={[styles.paddedContainer, styles.contentContainer]}
                  >
                    <View style={styles.boxShadow}>
                      <Text fontWeight="bold" style={{marginBottom: 20}}>
                        Daily Goals.
                      </Text>
                      {fitbitUserID && fitbitAccessToken ? (
                        <ProgressWithLabel
                          label="Steps"
                          currentValue={steps}
                          maxValue={result.stepsGoal}
                          unit="steps"
                          containerStyle={{marginBottom: 25}}
                          iconName="refresh-cw"
                          onIconPress={() => {}}
                          isClaimed={stepGoalClaimed}
                          onClaimPress={this._onStepGoalClaim}
                        />
                      ) : (
                        <LockedProgressGoal
                          containerStyle={{marginBottom: 25}}
                        />
                      )}
                      <ProgressWithLabel
                        label="Drink water"
                        currentValue={waterValue}
                        maxValue={result.waterGoal}
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
                          currentValue={result.intakeValue}
                          maxValue={result.goalIntake}
                          buttonTitle="INTAKE"
                          onPress={goToSearchFood}
                        />
                        <CaloriesInfo
                          image={fire}
                          currentValue={caloriesBMR + result.workoutValue}
                          maxValue={result.goalWorkout}
                          buttonTitle="WORKOUT"
                          onPress={goToSearchWorkout}
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
                )}
                <AnimatedChevron />
              </View>
              <View style={styles.scrollHeight}>
                {fitbitUserID && fitbitAccessToken ? (
                  <StepsChartPage
                    distances={distances}
                    steps={steps}
                    floors={floors}
                  />
                ) : (
                  <LockedScene
                    navigation={this.props.navigation}
                    updateFunc={this._updateFitbitAuth}
                  />
                )}
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
        }}
      </Query>
    );
  }

  _resetDailyState = () => {
    alert('halo');
  };

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
  _updateFitbitAuth: UpdateFitbitAuthFn = (
    fitbitUserID: string,
    fitbitAccessToken: string,
  ) => {
    this.setState({fitbitUserID, fitbitAccessToken});
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
