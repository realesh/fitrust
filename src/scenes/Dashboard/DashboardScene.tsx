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
import {
  UPDATE_WATER,
  UpdateWaterResponse,
  UpdateWaterVariables,
  CLAIM_WATER,
  ClaimWaterResponse,
  ClaimWaterVariables,
  CLAIM_STEP,
  ClaimStepResponse,
  ClaimStepVariables,
} from '../../graphql/queries/dashboardV2';
import {
  CONNECT_BADGE,
  ConnectBadgeResponse,
  ConnectBadgeVariables,
} from '../../graphql/mutations/exerciseMode';
import {BADGESES} from '../../generals/constants/badgesList';
import {USER_PROFILE, BADGES_LIST} from '../../graphql/queries/profile';
import BadgeModal from '../../generals/components/BadgeModal';
import {LEADERBOARD_LIST} from '../../graphql/queries/leaderboard';

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

type BagdeUnlockedState = {
  badgePoints: number;
  badgeImageUrl: string;
  badgeName: string;
};

type BaseState = TodayActivitiesResponseSummary &
  BagdeUnlockedState & {
    fadeInAnimatedValue: Animated.Value;
    bmrModalVisible: boolean;
    waterModalVisible: boolean;
    stepClaimModalVisible: boolean;
    waterClaimModalVisible: boolean;
    userDisplayName: string;
    fitbitUserID: string;
    fitbitAccessToken: string;
    fetchFitbitLoading: boolean;

    // badge related
    stepsClaimedTotal: number;
    watersClaimedTotal: number;
    badgeEarnedModalVisible: boolean;
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
    stepGoalClaimed: false,
    stepClaimModalVisible: false,
    waterClaimModalVisible: false,
    userDisplayName: '',
    fitbitUserID: '',
    fitbitAccessToken: '',
    fetchFitbitLoading: true,
    ...DEFAULT_ACTIVITIES_SUMMARY,

    // badge related
    stepsClaimedTotal: 0,
    watersClaimedTotal: 0,
    badgePoints: 0,
    badgeImageUrl: '',
    badgeName: '',
    badgeEarnedModalVisible: false,
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
      'Recalculate your these numbers every month to maintain the accuracy.';

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
              currPoints: result.points,
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
                        this._renderStepsDailyGoal(
                          steps,
                          result.stepsGoal,
                          !!result.todayStepClaimed,
                        )
                      ) : (
                        <LockedProgressGoal
                          containerStyle={{marginBottom: 25}}
                        />
                      )}
                      {this._renderWaterDailyGoal(
                        result.waterValue,
                        result.waterGoal,
                        !!result.todaywaterClaimed,
                      )}
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

              {this._renderWaterModal(result.waterValue)}
              {this._renderStepClaimModal()}
              {this._renderWaterClaimModal()}
              <BadgeModal
                visible={this.state.badgeEarnedModalVisible}
                pointsValue={this.state.badgePoints}
                name={this.state.badgeName}
                imageUrl={this.state.badgeImageUrl}
                onRequestClose={this._toggleBadgeEarnedModal}
              />
            </ScrollView>
          );
        }}
      </Query>
    );
  }

  _renderWaterModal = (currWater: number) => (
    <Mutation<UpdateWaterResponse, UpdateWaterVariables>
      mutation={UPDATE_WATER}
    >
      {(updateWater) => {
        let handleUpdate = async (water: number) => {
          try {
            let ID = await AsyncStorage.getItem('userID');
            updateWater &&
              (await updateWater({
                variables: {
                  userID: ID || '',
                  water: currWater + water,
                },
                refetchQueries: [
                  {
                    query: USER_DASHBOARD,
                    variables: {
                      userID: ID,
                    },
                  },
                ],
              }));
            this._toggleWaterModal();
          } catch (error) {
            // Handle Error
          }
        };
        return (
          <DrinkWaterModal
            visible={this.state.waterModalVisible}
            onAddPress={handleUpdate}
          />
        );
      }}
    </Mutation>
  );

  _renderWaterDailyGoal = (
    waterValue: number,
    waterGoal: number,
    isClaimed: boolean,
  ) => (
    <Mutation<ClaimWaterResponse, ClaimWaterVariables> mutation={CLAIM_WATER}>
      {(claimWater, {loading}) => {
        let handleClaim = async () => {
          try {
            let ID = await AsyncStorage.getItem('userID');
            let res =
              claimWater &&
              (await claimWater({
                variables: {
                  userID: ID || '',
                },
                refetchQueries: [
                  {
                    query: USER_DASHBOARD,
                    variables: {
                      userID: ID,
                    },
                  },
                ],
              }));
            if (
              res &&
              res.data &&
              res.data.claimWaterGoal &&
              res.data.claimWaterGoal.total
            ) {
              this.setState({
                watersClaimedTotal: res.data.claimWaterGoal.total,
              });
            }
            this._toggleWaterClaimModalVisible();
          } catch (error) {
            // Handle Error
          }
        };
        return (
          <ProgressWithLabel
            label="Drink water"
            currentValue={loading ? 0 : waterValue}
            maxValue={waterGoal}
            unit="glass"
            iconName="plus-square"
            onIconPress={this._toggleWaterModal}
            isClaimed={isClaimed}
            onClaimPress={handleClaim}
          />
        );
      }}
    </Mutation>
  );

  _renderStepsDailyGoal = (
    stepsValue: number,
    stepsGoal: number,
    isClaimed: boolean,
  ) => (
    <Mutation<ClaimStepResponse, ClaimStepVariables> mutation={CLAIM_STEP}>
      {(claimStep, {loading}) => {
        let handleClaim = async () => {
          try {
            let ID = await AsyncStorage.getItem('userID');
            let res =
              claimStep &&
              (await claimStep({
                variables: {
                  userID: ID || '',
                },
                refetchQueries: [
                  {
                    query: USER_DASHBOARD,
                    variables: {
                      userID: ID,
                    },
                  },
                ],
              }));
            if (
              res &&
              res.data &&
              res.data.claimStepsGoal &&
              res.data.claimStepsGoal.total
            ) {
              this.setState({
                stepsClaimedTotal: res.data.claimStepsGoal.total,
              });
            }
            this._toggleStepClaimModalVisible();
          } catch (error) {
            // Handle Error
          }
        };
        return (
          <ProgressWithLabel
            label="Steps"
            currentValue={loading ? 0 : stepsValue}
            maxValue={stepsGoal}
            unit="steps"
            containerStyle={{marginBottom: 25}}
            iconName="refresh-cw"
            onIconPress={this._fetchStepInfo}
            isClaimed={isClaimed}
            onClaimPress={handleClaim}
          />
        );
      }}
    </Mutation>
  );

  _renderWaterClaimModal = () => (
    <Mutation<ConnectBadgeResponse, ConnectBadgeVariables>
      mutation={CONNECT_BADGE}
    >
      {(connectBadge) => {
        let handleConnect = async () => {
          let badgeUnlocked = '';
          switch (this.state.watersClaimedTotal) {
            case 1:
              badgeUnlocked = BADGESES.water1;
              break;
            case 5:
              badgeUnlocked = BADGESES.water5;
              break;
            case 25:
              badgeUnlocked = BADGESES.water25;
              break;
            case 50:
              badgeUnlocked = BADGESES.water50;
              break;
            case 100:
              badgeUnlocked = BADGESES.water100;
              break;
          }
          if (badgeUnlocked) {
            try {
              let ID = await AsyncStorage.getItem('userID');
              let res =
                connectBadge &&
                (await connectBadge({
                  variables: {
                    userID: ID || '',
                    badgeID: badgeUnlocked,
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
                    {
                      query: LEADERBOARD_LIST,
                    },
                  ],
                }));
              if (
                res &&
                res.data &&
                res.data.connectBadges &&
                res.data.connectBadges.statusCode === 200
              ) {
                this.setState({
                  badgeName: res.data.connectBadges.name,
                  badgeImageUrl: res.data.connectBadges.imageUrl,
                  badgePoints: res.data.connectBadges.badgePoints,
                  badgeEarnedModalVisible: true,
                });
              }
            } catch (error) {
              // Handle Error
            }
          }
          this._toggleWaterClaimModalVisible();
        };
        return (
          <PointsModal
            visible={this.state.waterClaimModalVisible}
            pointsSource="Daily Goal - Drink Water"
            pointsValue={50}
            onRequestClose={handleConnect}
          />
        );
      }}
    </Mutation>
  );

  _renderStepClaimModal = () => (
    <Mutation<ConnectBadgeResponse, ConnectBadgeVariables>
      mutation={CONNECT_BADGE}
    >
      {(connectBadge) => {
        let handleConnect = async () => {
          let badgeUnlocked = '';
          switch (this.state.stepsClaimedTotal) {
            case 1:
              badgeUnlocked = BADGESES.step1;
              break;
            case 5:
              badgeUnlocked = BADGESES.step5;
              break;
            case 25:
              badgeUnlocked = BADGESES.step25;
              break;
            case 50:
              badgeUnlocked = BADGESES.step50;
              break;
            case 100:
              badgeUnlocked = BADGESES.step100;
              break;
          }

          if (badgeUnlocked) {
            try {
              let ID = await AsyncStorage.getItem('userID');
              let res =
                connectBadge &&
                (await connectBadge({
                  variables: {
                    userID: ID || '',
                    badgeID: badgeUnlocked,
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
                    {
                      query: LEADERBOARD_LIST,
                    },
                  ],
                }));
              if (
                res &&
                res.data &&
                res.data.connectBadges &&
                res.data.connectBadges.statusCode === 200
              ) {
                this.setState({
                  badgeName: res.data.connectBadges.name,
                  badgeImageUrl: res.data.connectBadges.imageUrl,
                  badgePoints: res.data.connectBadges.badgePoints,
                  badgeEarnedModalVisible: true,
                });
              }
            } catch (error) {
              // Handle Error
            }
          }
          this._toggleStepClaimModalVisible();
        };
        return (
          <PointsModal
            visible={this.state.stepClaimModalVisible}
            pointsSource="Daily Goal - Step"
            pointsValue={100}
            onRequestClose={handleConnect}
          />
        );
      }}
    </Mutation>
  );

  _resetDailyState = () => {
    alert('halo');
  };

  _toggleBMRModal = () => {
    this.setState({bmrModalVisible: !this.state.bmrModalVisible});
  };
  _toggleWaterModal = () => {
    this.setState({waterModalVisible: !this.state.waterModalVisible});
  };
  _toggleBadgeEarnedModal = () => {
    this.setState({
      badgeEarnedModalVisible: !this.state.badgeEarnedModalVisible,
    });
  };
  _goToBMR = () => {
    let {navigation} = this.props;
    this.setState({bmrModalVisible: false});
    navigation.navigate('BMRCalculator', {previous_scene: 'Home'});
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
