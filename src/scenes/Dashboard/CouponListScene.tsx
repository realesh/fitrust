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
import {Toolbar} from '../../generals/components';
import {
  WHITE,
  BLUE,
  LIGHTER_GREY,
  WHITE30,
  GREEN,
  GREEN30,
  LIGHT_GREY,
} from '../../generals/constants/colors';
import {Query} from 'react-apollo';
import {
  USER_COUPONS,
  UserCouponsResponse,
  UserCouponsVariables,
  ExerciseCoupon,
} from '../../graphql/mutations/exerciseMode';
import {Text} from '../../generals/core-ui';
import {
  HEADER_FONT_SIZE,
  SMALL_FONT_SIZE,
  LARGE_FONT_SIZE,
  TINY_FONT_SIZE,
  MEDIUM_FONT_SIZE,
} from '../../generals/constants/size';

type NavigationScreenParams = {
  userID: string;
};

type Props = NavigationScreenProps<NavigationScreenParams>;

type State = {
  minimizeHeader: boolean;
};

export default class CouponsListScene extends Component<Props, State> {
  state: State = {
    minimizeHeader: false,
  };

  offset = 0;

  render() {
    let {navigation} = this.props;

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
            let mhr =
              (data &&
                data.user &&
                data.user.profile &&
                data.user.profile.bpm) ||
              220 - age;
            console.log(mhr, '<<<<<<<<<<<');
          }

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
                  renderItem={this._renderItem}
                  ItemSeparatorComponent={this._renderSeparator}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={this._keyExtractor}
                />
              </View>
            </View>
          );
        }}
      </Query>
    );
  }

  _renderItem = ({item}: ListRenderItemInfo<ExerciseCoupon>) => {
    return (
      <TouchableOpacity activeOpacity={0.6} style={styles.couponContainer}>
        <View style={styles.couponTypeInfo}>
          <View style={styles.typeInitialBox}>
            <Text
              fontWeight="bold"
              fontSize={HEADER_FONT_SIZE}
              style={styles.whiteText}
            >
              {item.type[0]}
            </Text>
          </View>
        </View>
        <View style={styles.topSeparatorCircle} />
        <View style={styles.bottomSeparatorCircle} />
        <View style={styles.exDetailInfo}>
          <Text
            fontWeight="bold"
            fontSize={LARGE_FONT_SIZE}
            style={{marginBottom: 5}}
          >
            {item.type}
          </Text>
          <Text
            fontWeight="light"
            fontSize={SMALL_FONT_SIZE}
            style={{marginBottom: 3}}
          >
            {`${item.startTime} - ${item.finishTime}`}
          </Text>
          <Text fontWeight="light" fontSize={TINY_FONT_SIZE}>
            {`issued date: ${item.date}`}
          </Text>
          <View style={styles.durationContainer}>
            <Text fontWeight="bold" style={{color: GREEN}}>
              {`${item.duration} mins`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderSeparator = () => <View style={{height: 20}} />;

  _keyExtractor = (_item: ExerciseCoupon, index: number) => String(index);
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
  couponContainer: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: WHITE,
  },
  couponTypeInfo: {
    height: '100%',
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BLUE,
  },
  typeInitialBox: {
    height: 60,
    width: 60,
    backgroundColor: WHITE30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  whiteText: {color: WHITE},
  greenText: {color: GREEN},
  topSeparatorCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    position: 'absolute',
    left: 90,
    top: -10,
    backgroundColor: LIGHTER_GREY,
  },
  bottomSeparatorCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    position: 'absolute',
    left: 90,
    bottom: -10,
    backgroundColor: LIGHTER_GREY,
  },
  exDetailInfo: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  durationContainer: {
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: GREEN30,
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
