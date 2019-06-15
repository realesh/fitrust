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
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  Image,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Toolbar, PopupDialog} from '../../generals/components';
import {
  WHITE,
  LIGHT_GREY,
  LIGHTER_GREY,
  BLUE,
  BLUE30,
} from '../../generals/constants/colors';
import AvatarWithMedal from './components/AvatarWithMedal';
import {userLoggedIn} from './data/LeaderboardDataFixtures';
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
  BadgesImage,
  UserLeaderboardData,
} from '../../graphql/queries/leaderboard';
import {imageResolvers} from '../../helpers/imageResolvers';
import {Avatar, Text} from '../../generals/core-ui';
import {LARGE_FONT_SIZE} from '../../generals/constants/size';

type Props = NavigationScreenProps;

type PreviewedProfile = {
  pName: string;
  pAvatar: string;
  pTitle: string;
  pBadges: Array<BadgesImage>;
};

type State = PreviewedProfile & {
  minimizeHeader: boolean;
  userID: string;
  previewModalVisible: boolean;
};

export default class LeaderboardScene extends Component<Props, State> {
  state: State = {
    minimizeHeader: false,
    userID: '',
    previewModalVisible: false,
    pName: '',
    pAvatar: '',
    pTitle: '',
    pBadges: [],
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
    let {
      minimizeHeader,
      previewModalVisible,
      pAvatar,
      pBadges,
      pName,
      pTitle,
    } = this.state;

    let topThreeContainer = [
      styles.topThreeContainer,
      minimizeHeader && styles.minimizedContainer,
    ];

    return (
      <Query<LeaderboardResponse, LeaderboardVariables>
        query={LEADERBOARD_LIST}
        fetchPolicy="network-only"
      >
        {({data, loading}) => {
          let result = (data && data.profiles) || [];

          let top20result =
            result.length <= 20 ? [...result] : [...result.slice(0, 19)];
          let [firstPosUser, secondPosUser, thirdPosUser] = top20result;

          // CHANGE THIS DUMB IMPLEMENTATION LATER
          let firstPosOnPress = () => {
            this.setState({
              pName: firstPosUser.name,
              pAvatar: firstPosUser.avatarUrl,
              pBadges: firstPosUser.badges,
              pTitle: `${firstPosUser.titleFirst} ${firstPosUser.titleMiddle} ${
                firstPosUser.titleLast
              }`,
              previewModalVisible: true,
            });
          };
          let secondPosOnPress = () => {
            this.setState({
              pName: secondPosUser.name,
              pAvatar: secondPosUser.avatarUrl,
              pBadges: secondPosUser.badges,
              pTitle: `${secondPosUser.titleFirst} ${
                secondPosUser.titleMiddle
              } ${secondPosUser.titleLast}`,
              previewModalVisible: true,
            });
          };
          let thirdPosOnPress = () => {
            this.setState({
              pName: thirdPosUser.name,
              pAvatar: thirdPosUser.avatarUrl,
              pBadges: thirdPosUser.badges,
              pTitle: `${thirdPosUser.titleFirst} ${thirdPosUser.titleMiddle} ${
                thirdPosUser.titleLast
              }`,
              previewModalVisible: true,
            });
          };

          return loading ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <ActivityIndicator color={BLUE} size="large" />
            </View>
          ) : (
            <View style={styles.root}>
              <Toolbar navigation={navigation} title="Leaderboard" />
              <Animated.View
                style={[styles.paddedContainer, topThreeContainer]}
              >
                <AvatarWithMedal
                  rank="silver"
                  name={secondPosUser.name}
                  points={secondPosUser.points}
                  avatarSource={imageResolvers(secondPosUser.avatarUrl)}
                  avatarMinimized={minimizeHeader}
                  onPress={secondPosOnPress}
                />
                <AvatarWithMedal
                  rank="gold"
                  name={firstPosUser.name}
                  points={firstPosUser.points}
                  avatarSource={imageResolvers(firstPosUser.avatarUrl)}
                  avatarMinimized={minimizeHeader}
                  onPress={firstPosOnPress}
                />
                <AvatarWithMedal
                  rank="bronze"
                  name={thirdPosUser.name}
                  points={thirdPosUser.points}
                  avatarSource={imageResolvers(thirdPosUser.avatarUrl)}
                  avatarMinimized={minimizeHeader}
                  onPress={thirdPosOnPress}
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
                      (user: UserLeaderboardData) => {
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

              <PopupDialog
                visible={previewModalVisible}
                onRequestClose={this._toggleModalVisible}
              >
                <Avatar
                  size="big"
                  source={imageResolvers(pAvatar)}
                  style={{marginBottom: 10}}
                />
                <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
                  {pName}
                </Text>
                <View style={styles.titleContainer}>
                  <Text style={{color: BLUE}}>{pTitle}</Text>
                </View>
                <View style={styles.badgesContainer}>
                  <FlatList
                    data={pBadges}
                    renderItem={this._renderPreviewedBadge}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._badgesKeyExtractor}
                    numColumns={3}
                  />
                </View>
              </PopupDialog>
            </View>
          );
        }}
      </Query>
    );
  }

  _toggleModalVisible = () => {
    this.setState({previewModalVisible: !this.state.previewModalVisible});
  };

  _renderItem = ({item, index}: ListRenderItemInfo<UserLeaderboardData>) => {
    let onPress = () => {
      this.setState({
        pName: item.name,
        pAvatar: item.avatarUrl,
        pBadges: item.badges,
        pTitle: `${item.titleFirst} ${item.titleMiddle} ${item.titleLast}`,
        previewModalVisible: true,
      });
    };
    return (
      <UserRowItem
        name={item.name}
        points={item.points}
        rankNumber={index + 4}
        avatarUri={item.avatarUrl}
        onPress={onPress}
      />
    );
  };

  _renderPreviewedBadge = ({item, index}: ListRenderItemInfo<BadgesImage>) => {
    let avatarStyle: StyleProp<ViewStyle> = {
      width: '30%',
      aspectRatio: 1,
      borderRadius: 10,
      marginRight: (index + 1) % 3 === 0 ? 0 : 10,
      overflow: 'hidden',
    };
    return (
      <View style={avatarStyle}>
        <Image source={{uri: item.imageUrl}} style={styles.badgeIconStyle} />
      </View>
    );
  };

  _badgesKeyExtractor = (_item: BadgesImage, index: number) => String(index);

  _renderSeparator = () => <Separator style={{marginLeft: '14%'}} />;

  _keyExtractor = (_item: UserLeaderboardData, index: number) => String(index);

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
  badgeIconStyle: {
    height: '100%',
    width: '100%',
  },
  badgesContainer: {
    width: '100%',
  },
  titleContainer: {
    width: '80%',
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: BLUE30,
    alignItems: 'center',
  },
});
