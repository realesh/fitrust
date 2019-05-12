import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutAnimation,
  AsyncStorage,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Toolbar} from '../../generals/components';
import {WHITE, LIGHT_GREY, LIGHTER_GREY} from '../../generals/constants/colors';
import AvatarWithMedal from './components/AvatarWithMedal';
import {
  usersListData,
  UserLeaderboard,
  userLoggedIn,
} from './data/LeaderboardDataFixtures';
import Separator from '../../generals/core-ui/Separator';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import UserRowItem from './components/UserRowItem';
import {Query} from 'react-apollo';
import {
  LeaderboardResponse,
  LeaderboardVariables,
  UserLeaderboardResponse,
  UserLeaderboardVariables,
  LEADERBOARD_LIST,
  USER_LEADERBOARD_PROFILE,
} from '../../graphql/queries/leaderboard';

type Props = NavigationScreenProps;

type State = {
  minimizeHeader: boolean;
  userID: string;
};

export default class LeaderboardScene extends Component<Props, State> {
  state: State = {
    minimizeHeader: false,
    userID: '',
  };

  offset = 0;

  componentDidMount() {
    this._getID();
  }

  _getID = async () => {
    let userID = await AsyncStorage.getItem('userID');
    userID && this.setState({userID});
  };

  render() {
    let {navigation} = this.props;
    let {minimizeHeader} = this.state;

    let topThreeContainer = [
      styles.topThreeContainer,
      minimizeHeader && styles.minimizedContainer,
    ];

    return (
      <Query<LeaderboardResponse, LeaderboardVariables>
        query={LEADERBOARD_LIST}
      >
        {({data}) => {
          let result = (data && data.profiles) || usersListData;

          let top20result =
            result.length <= 20 ? [...result] : [...result.slice(0, 19)];
          let [firstPosUser, secondPosUser, thirdPosUser] = top20result;

          return (
            <View style={styles.root}>
              <Toolbar navigation={navigation} title="Leaderboard" />
              <Animated.View
                style={[styles.paddedContainer, topThreeContainer]}
              >
                <AvatarWithMedal
                  rank="silver"
                  name={secondPosUser.name}
                  points={secondPosUser.points}
                  avatarSource={{
                    uri: secondPosUser.avatarUrl,
                  }}
                  avatarMinimized={minimizeHeader}
                />
                <AvatarWithMedal
                  rank="gold"
                  name={firstPosUser.name}
                  points={firstPosUser.points}
                  avatarSource={{
                    uri: firstPosUser.avatarUrl,
                  }}
                  avatarMinimized={minimizeHeader}
                />
                <AvatarWithMedal
                  rank="bronze"
                  name={thirdPosUser.name}
                  points={thirdPosUser.points}
                  avatarSource={{
                    uri: thirdPosUser.avatarUrl,
                  }}
                  avatarMinimized={minimizeHeader}
                />
              </Animated.View>
              <View style={styles.contentContainer}>
                <FlatList
                  data={top20result.slice(3)}
                  renderItem={this._renderItem}
                  ItemSeparatorComponent={this._renderSeparator}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={this._keyExtractor}
                  onScrollEndDrag={this._handleScrollVertical}
                  onScrollBeginDrag={this._handleBeginDrag}
                  onMomentumScrollEnd={this._handleMomentumEnd}
                />

                <Query<UserLeaderboardResponse, UserLeaderboardVariables>
                  query={USER_LEADERBOARD_PROFILE}
                  variables={{userID: this.state.userID}}
                >
                  {({data: userLeaderboardData, loading}) => {
                    let userLeaderboard =
                      (userLeaderboardData &&
                        userLeaderboardData.user &&
                        userLeaderboardData.user.profile) ||
                      userLoggedIn;

                    let userLeaderboardRank = result.findIndex(
                      (user: UserLeaderboard) => {
                        return user.name === userLeaderboard.name;
                      },
                    );

                    return (
                      !loading && (
                        <UserRowItem
                          name={userLeaderboard.name}
                          points={userLeaderboard.points}
                          rankNumber={userLeaderboardRank + 1}
                          avatarUri={userLeaderboard.avatarUrl}
                          currentUser={true}
                        />
                      )
                    );
                  }}
                </Query>
              </View>
            </View>
          );
        }}
      </Query>
    );
  }

  _renderItem = ({item, index}: ListRenderItemInfo<UserLeaderboard>) => {
    return (
      <UserRowItem
        name={item.name}
        points={item.points}
        rankNumber={index + 4}
        avatarUri={item.avatarUrl}
      />
    );
  };

  _renderSeparator = () => <Separator style={{marginLeft: '14%'}} />;

  _keyExtractor = (_item: UserLeaderboard, index: number) => String(index);

  _handleBeginDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.offset = event.nativeEvent.contentOffset.y;
  };

  _handleScrollVertical = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    let currentOffset = event.nativeEvent.contentOffset.y;
    if (currentOffset > this.offset) {
      LayoutAnimation.configureNext(linearEasingShort);
      this.setState({
        minimizeHeader: true,
      });
    }
  };

  _handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    let currentOffset = event.nativeEvent.contentOffset.y;
    if (currentOffset <= 0) {
      LayoutAnimation.configureNext(linearEasingShort);
      this.setState({
        minimizeHeader: false,
      });
    }
  };

  // _findUserIndex(user: UserLeaderboard) {
  //   return user.name === 'Depp';
  // }
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
  },
  paddedContainer: {
    paddingHorizontal: 20,
    backgroundColor: WHITE,
  },
  topThreeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxHeight: '30%',
    paddingBottom: 10,
  },
  minimizedContainer: {
    maxHeight: '17%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: LIGHTER_GREY,
    borderTopWidth: 1,
    borderColor: LIGHT_GREY,
  },
});
