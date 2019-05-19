import React, {Component} from 'react';
import {View, StyleSheet, FlatList, ListRenderItemInfo} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Toolbar} from '../../generals/components';
import {WHITE} from '../../generals/constants/colors';
import Separator from '../../generals/core-ui/Separator';
import BadgeRowItem from './components/BadgeRowItem';
import {Query} from 'react-apollo';
import {
  BADGES_LIST,
  BadgesListResponse,
  BadgesListVariables,
} from '../../graphql/queries/profile';
import {BadgeItem} from './data/BadgeDataFixtures';

type NavigationScreenParams = {
  userID: string;
};

type Props = NavigationScreenProps<NavigationScreenParams>;

type State = {
  minimizeHeader: boolean;
};

export default class BadgesListScene extends Component<Props, State> {
  state: State = {
    minimizeHeader: false,
  };

  offset = 0;

  render() {
    let {navigation} = this.props;

    return (
      <Query<BadgesListResponse, BadgesListVariables>
        query={BADGES_LIST}
        variables={{userID: this.props.navigation.getParam('userID', '')}}
      >
        {({data}) => {
          let result = data && data.badgesList;
          let badgesList: Array<BadgeItem> = [];
          if (result) {
            let unlocked = result.userBadges.map((badge) => {
              return {
                ...badge,
                unlocked: true,
              };
            });
            let locked = result.lockedBadges.map((badge) => {
              return {
                ...badge,
                unlocked: false,
              };
            });
            badgesList = [...unlocked, ...locked];
          }

          return (
            <View style={styles.root}>
              <Toolbar navigation={navigation} title="Badges" />
              <View style={styles.contentContainer}>
                <FlatList
                  data={badgesList}
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

  _renderItem = ({item}: ListRenderItemInfo<Partial<BadgeItem>>) => {
    return (
      <BadgeRowItem
        name={item.name || ''}
        desc={item.desc || ''}
        thumbUri={item.imageUrl || ''}
        unlocked={item.unlocked}
      />
    );
  };

  _renderSeparator = () => <Separator style={{marginLeft: '25%'}} />;

  _keyExtractor = (_item: BadgeItem, index: number) => String(index);
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
  contentContainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
});
