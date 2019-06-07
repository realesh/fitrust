import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Toolbar, PointsModal, PopupInfoDialog} from '../../generals/components';
import {
  WHITE,
  BLUE,
  LIGHTER_GREY,
  LIGHT_GREY,
} from '../../generals/constants/colors';
import {Query, Mutation} from 'react-apollo';
import {
  USER_COUPONS,
  UserCouponsResponse,
  UserCouponsVariables,
  ExerciseCoupon,
  ExerciseTypeEnum,
  DELETE_COUPON,
  DeleteCouponResponse,
  DeleteCouponVariables,
} from '../../graphql/mutations/exerciseMode';
import {Text} from '../../generals/core-ui';
import {MEDIUM_FONT_SIZE} from '../../generals/constants/size';
import fetchExerciseMode from '../../helpers/Fetchers/fetchExerciseMode';
import {intensitiesData} from '../ExerciseMode/data/ExerciseModeDataFixtures';
import CouponListItem from './components/CouponListItem';
import {USER_DASHBOARD} from '../../graphql/queries/dashboard';
import {LEADERBOARD_LIST} from '../../graphql/queries/leaderboard';

type NavigationScreenParams = {
  userID: string;
  fitbitUserID: string;
  fitbitAccessToken: string;
  currPoints: number;
};

type Props = NavigationScreenProps<NavigationScreenParams>;

type State = {
  exModeEffectivityResult: number;
  exModeEarnedPoints: number;
  resultModalVisible: boolean;
  notReadyModalVisible: boolean;
  selectedCouponID: string;
};

export default class CouponsListScene extends Component<Props, State> {
  state: State = {
    exModeEffectivityResult: 0,
    exModeEarnedPoints: 0,
    resultModalVisible: false,
    notReadyModalVisible: false,
    selectedCouponID: '',
  };

  offset = 0;

  render() {
    let {navigation} = this.props;
    let {notReadyModalVisible} = this.state;

    let notReadyMessage =
      "Looks like your exercise data hasn't being synchronized.\n" +
      'Open your Fitbit app and sync your device, then try again after 5-10 mins';

    return (
      <Query<UserCouponsResponse, UserCouponsVariables>
        query={USER_COUPONS}
        variables={{userID: this.props.navigation.getParam('userID', '')}}
      >
        {({data, loading}) => {
          let exerciseCoupons =
            (data &&
              data.user &&
              data.user.profile &&
              data.user.profile.exerciseCoupons) ||
            [];

          let mhr = 220;
          if (!loading) {
            let dob =
              (data &&
                data.user &&
                data.user.profile &&
                data.user.profile.dob) ||
              '';
            let now = new Date().getFullYear();
            let dobYear = new Date(dob).getFullYear();
            let age = now - dobYear;
            mhr =
              (data &&
                data.user &&
                data.user.profile &&
                data.user.profile.bpm) ||
              220 - age;
          }

          let renderCoupon = ({item}: ListRenderItemInfo<ExerciseCoupon>) => {
            let onPress = () => {
              this._fetchResults(
                item.duration,
                item.startTime,
                item.finishTime,
                item.date,
                item.type,
                mhr,
              );
              this.setState({selectedCouponID: item.id});
            };

            return <CouponListItem item={item} onPress={onPress} />;
          };

          return loading ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <ActivityIndicator color={BLUE} size="large" />
            </View>
          ) : (
            <View style={styles.root}>
              <Toolbar navigation={navigation} title="Coupons" />
              <View style={styles.headerContainer}>
                <Text fontSize={MEDIUM_FONT_SIZE}>
                  Here are the coupons that you earned through
                  <Text fontSize={MEDIUM_FONT_SIZE} fontWeight="bold">
                    {' Exercise Mode. '}
                  </Text>
                </Text>
                <Text fontSize={MEDIUM_FONT_SIZE}>
                  Click to
                  <Text fontSize={MEDIUM_FONT_SIZE} fontWeight="bold">
                    {' redeem '}
                  </Text>
                  coupon to points.
                </Text>
              </View>
              <View style={styles.contentContainer}>
                <FlatList
                  data={exerciseCoupons}
                  renderItem={renderCoupon}
                  ItemSeparatorComponent={this._renderSeparator}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={this._keyExtractor}
                  contentContainerStyle={{paddingBottom: 20}}
                />
              </View>
              <PopupInfoDialog
                visible={notReadyModalVisible}
                title="Sorry"
                message={notReadyMessage}
                onRequestClose={this._toggleNotReadyModal}
                buttonTitle="Got it"
                buttonOnPress={this._toggleNotReadyModal}
              />
              {this._renderResultModal()}
            </View>
          );
        }}
      </Query>
    );
  }

  _renderSeparator = () => <View style={{height: 20}} />;

  _keyExtractor = (_item: ExerciseCoupon, index: number) => String(index);

  _fetchResults = async (
    duration: number,
    startTime: string,
    finishTime: string,
    date: string,
    type: ExerciseTypeEnum,
    mhr: number,
  ) => {
    let fitbitUserID = this.props.navigation.getParam('fitbitUserID');
    let fitbitAccessToken = this.props.navigation.getParam('fitbitAccessToken');
    let [data] = intensitiesData.filter(
      (intensity) => intensity.title === type,
    );
    let topBound = data.max * mhr;
    let lowBound = data.min * mhr;
    let multiplier = 1 + duration / 100;
    if (fitbitUserID && fitbitAccessToken) {
      let fitbitResponse = await fetchExerciseMode(
        fitbitUserID,
        fitbitAccessToken,
        startTime,
        finishTime,
        date,
      );
      let response =
        (fitbitResponse['activities-heart-intraday'] &&
          fitbitResponse['activities-heart-intraday'].dataset) ||
        [];
      if (response.length >= duration) {
        let bpmData = [...response.map((bpm) => bpm.value)];
        let total = bpmData.reduce((prev, curr) => prev + curr);
        let successData = bpmData.filter(
          (bpm) => lowBound < bpm && bpm <= topBound,
        );
        let successTotal = successData.length
          ? successData.reduce((prev, curr) => prev + curr)
          : 0;
        let exModeEffectivityResult = successTotal
          ? Math.floor((successTotal / total) * 100)
          : -1;
        let exModeEarnedPoints = successTotal
          ? Math.floor(
              (exModeEffectivityResult / 100) * data.optimalScore * multiplier,
            )
          : 0;
        this.setState({
          exModeEffectivityResult,
          exModeEarnedPoints,
          resultModalVisible: true,
        });
      } else {
        this._toggleNotReadyModal();
      }
    }
  };
  _renderResultModal = () => (
    <Mutation<DeleteCouponResponse, DeleteCouponVariables>
      mutation={DELETE_COUPON}
    >
      {(deleteCoupon) => {
        let {
          resultModalVisible,
          exModeEarnedPoints,
          exModeEffectivityResult,
        } = this.state;
        let currPoints = this.props.navigation.getParam('currPoints', 0);
        let onPress = async () => {
          try {
            let ID = this.props.navigation.getParam('userID', '');
            deleteCoupon &&
              (await deleteCoupon({
                variables: {
                  userID: this.props.navigation.getParam('userID', ''),
                  couponID: this.state.selectedCouponID,
                  addPoints: currPoints + exModeEarnedPoints,
                },
                refetchQueries: [
                  {
                    query: USER_DASHBOARD,
                    variables: {
                      userID: ID,
                    },
                  },
                  {
                    query: USER_COUPONS,
                    variables: {
                      userID: ID,
                    },
                  },
                  {
                    query: LEADERBOARD_LIST,
                  },
                ],
              }));
          } catch (error) {
            // Handle Error
          }
          this._closeResultModal();
        };

        return (
          <PointsModal
            visible={resultModalVisible}
            pointsSource="Exercise Mode"
            pointsValue={exModeEarnedPoints}
            exModeEffectivity={exModeEffectivityResult}
            onRequestClose={onPress}
          />
        );
      }}
    </Mutation>
  );
  _closeResultModal = () => {
    this.setState({resultModalVisible: false});
  };
  _toggleNotReadyModal = () => {
    this.setState({notReadyModalVisible: !this.state.notReadyModalVisible});
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: WHITE,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: LIGHTER_GREY,
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: LIGHT_GREY,
  },
});
