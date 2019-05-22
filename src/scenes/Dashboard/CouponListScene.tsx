import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Toolbar, PointsModal} from '../../generals/components';
import {
  WHITE,
  BLUE,
  LIGHTER_GREY,
  WHITE30,
  GREEN,
  GREEN30,
  LIGHT_GREY,
  DARK_GREY70,
} from '../../generals/constants/colors';
import {Query} from 'react-apollo';
import {
  USER_COUPONS,
  UserCouponsResponse,
  UserCouponsVariables,
  ExerciseCoupon,
  ExerciseTypeEnum,
} from '../../graphql/mutations/exerciseMode';
import {Text} from '../../generals/core-ui';
import {
  HEADER_FONT_SIZE,
  SMALL_FONT_SIZE,
  LARGE_FONT_SIZE,
  TINY_FONT_SIZE,
  MEDIUM_FONT_SIZE,
} from '../../generals/constants/size';
import fetchExerciseMode from '../../helpers/Fetchers/fetchExerciseMode';
import {intensitiesData} from '../ExerciseMode/data/ExerciseModeDataFixtures';
import CouponListItem from './components/CouponListItem';

type NavigationScreenParams = {
  userID: string;
  fitbitUserID: string;
  fitbitAccessToken: string;
};

type Props = NavigationScreenProps<NavigationScreenParams>;

type State = {
  exModeEffectivityResult: number;
  exModeEarnedPoints: number;
  resultModalVisible: boolean;
};

export default class CouponsListScene extends Component<Props, State> {
  state: State = {
    exModeEffectivityResult: 0,
    exModeEarnedPoints: 0,
    resultModalVisible: false,
  };

  offset = 0;

  render() {
    let {navigation} = this.props;
    let {
      exModeEarnedPoints,
      exModeEffectivityResult,
      resultModalVisible,
    } = this.state;

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
            let onPress = () =>
              this._fetchResults(
                item.duration,
                item.startTime,
                item.finishTime,
                item.type,
                mhr,
              );

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
                />
              </View>
              <PointsModal
                visible={resultModalVisible}
                pointsSource="Exercise Mode"
                pointsValue={exModeEarnedPoints}
                exModeEffectivity={exModeEffectivityResult}
                onRequestClose={this._closeResultModal}
              />
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
    if (fitbitUserID && fitbitAccessToken) {
      let fitbitResponse = await fetchExerciseMode(
        fitbitUserID,
        fitbitAccessToken,
        startTime,
        finishTime,
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
          ? Math.floor((exModeEffectivityResult / 100) * data.optimalScore)
          : 0;
        this.setState({
          exModeEffectivityResult,
          exModeEarnedPoints,
          resultModalVisible: true,
        });
      } else {
        // 0 data
        console.log('fetchfails');
      }
    }
  };
  _closeResultModal = () => {
    this.setState({resultModalVisible: false});
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
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: LIGHT_GREY,
  },
});
