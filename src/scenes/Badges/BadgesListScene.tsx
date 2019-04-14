import React, {Component} from 'react';
import {View, StyleSheet, FlatList, ListRenderItemInfo} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Toolbar} from '../../generals/components';
import {WHITE} from '../../generals/constants/colors';
import Separator from '../../generals/core-ui/Separator';
import BadgeRowItem from './components/BadgeRowItem';
import {BadgeItem, badgesList} from './data/BadgeDataFixtures';

type Props = NavigationScreenProps;

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
  }

  _renderItem = ({item}: ListRenderItemInfo<BadgeItem>) => {
    return (
      <BadgeRowItem
        name={item.name}
        desc={item.desc}
        thumbUri={item.thumbUri}
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
