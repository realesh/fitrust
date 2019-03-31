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
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Toolbar} from '../../generals/components';
import {WHITE, LIGHT_GREY, LIGHTER_GREY} from '../../generals/constants/colors';
import AvatarWithMedal from './components/AvatarWithMedal';
import {
  topThreeData,
  usersListData,
  UserLeaderboard,
  userLoggedIn,
} from './data/LeaderboardDataFixtures';
import Separator from '../../generals/core-ui/Separator';
import {linearEasingShort} from '../../generals/constants/animationConfig';
import UserRowItem from './components/UserRowItem';

type Props = NavigationScreenProps;

type State = {
  minimizeHeader: boolean;
};

export default class LeaderboardScene extends Component<Props, State> {
  state: State = {
    minimizeHeader: false,
  };

  offset = 0;

  render() {
    let {navigation} = this.props;
    let {minimizeHeader} = this.state;

    let [firstPosUser, secondPosUser, thirdPosUser] = topThreeData;

    let topThreeContainer = [
      styles.topThreeContainer,
      minimizeHeader && styles.minimizedContainer,
    ];

    let userLoggedInRank = usersListData.findIndex(this._findUserIndex);

    return (
      <View style={styles.root}>
        <Toolbar navigation={navigation} title="Leaderboard" />
        <Animated.View style={[styles.paddedContainer, topThreeContainer]}>
          <AvatarWithMedal
            rank="silver"
            name={secondPosUser.name}
            points={secondPosUser.points}
            avatarSource={{
              uri: secondPosUser.avatarUri,
            }}
            avatarMinimized={minimizeHeader}
          />
          <AvatarWithMedal
            rank="gold"
            name={firstPosUser.name}
            points={firstPosUser.points}
            avatarSource={{
              uri: firstPosUser.avatarUri,
            }}
            avatarMinimized={minimizeHeader}
          />
          <AvatarWithMedal
            rank="bronze"
            name={thirdPosUser.name}
            points={thirdPosUser.points}
            avatarSource={{
              uri: thirdPosUser.avatarUri,
            }}
            avatarMinimized={minimizeHeader}
          />
        </Animated.View>
        <View style={styles.contentContainer}>
          <FlatList
            data={usersListData.slice(3)}
            renderItem={this._renderItem}
            ItemSeparatorComponent={this._renderSeparator}
            showsVerticalScrollIndicator={false}
            keyExtractor={this._keyExtractor}
            onScrollEndDrag={this._handleScrollVertical}
            onScrollBeginDrag={this._handleBeginDrag}
            onMomentumScrollEnd={this._handleMomentumEnd}
          />

          <UserRowItem
            name={userLoggedIn.name}
            points={userLoggedIn.points}
            rankNumber={userLoggedInRank + 1}
            avatarUri={userLoggedIn.avatarUri}
            currentUser={true}
          />
        </View>
      </View>
    );
  }

  _renderItem = ({item, index}: ListRenderItemInfo<UserLeaderboard>) => {
    return (
      <UserRowItem
        name={item.name}
        points={item.points}
        rankNumber={index + 4}
        avatarUri={item.avatarUri}
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

  _findUserIndex(user: UserLeaderboard) {
    return user.name === userLoggedIn.name;
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
