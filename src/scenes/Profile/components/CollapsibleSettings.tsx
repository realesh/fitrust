import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import {Text, Button} from '../../../generals/core-ui';
import {Feather as Icon} from '@expo/vector-icons';
import {
  GREY,
  LIGHT_GREY,
  LIGHTER_GREY,
} from '../../../generals/constants/colors';
import {LARGE_FONT_SIZE, SCREEN_HEIGHT} from '../../../generals/constants/size';
import {linearEasingShort} from '../../../generals/constants/animationConfig';
import {SettingsItem} from '../data/settingsDataFixtures';
import {NavigationScreenProps} from 'react-navigation';

type Props = NavigationScreenProps & {
  logountFunc: () => void;
  settingsItems: Array<SettingsItem>;
};

type State = {
  collapsed: boolean;
};

export default class CollapsibleSettings extends Component<Props, State> {
  state = {
    collapsed: false,
  };
  render() {
    let {settingsItems} = this.props;
    let {collapsed} = this.state;

    let collapsibleHeight = {
      maxHeight: collapsed ? SCREEN_HEIGHT : 0,
    };

    return (
      <View style={styles.optionsContainer}>
        <Button
          iconName="settings"
          fontColor={GREY}
          fontSize={LARGE_FONT_SIZE}
          onPress={this._toggleCollapsible}
          style={[styles.iconButton, styles.settingsButton]}
        />
        <View style={collapsibleHeight}>
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={styles.optionsItemContainer}
            data={settingsItems}
            renderItem={this._renderOptionsItem}
            keyExtractor={this._keyExtractor}
            ListFooterComponent={this._renderListFooter}
          />
        </View>
      </View>
    );
  }

  _toggleCollapsible = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({collapsed: !this.state.collapsed});
  };

  _renderListFooter = () => {
    let {logountFunc} = this.props;
    return (
      <TouchableOpacity style={styles.paddedItem} onPress={logountFunc}>
        <View style={{flex: 1, paddingRight: 20}}>
          <Text>Logout</Text>
        </View>
        <Icon name="chevron-right" color={GREY} style={styles.iconButton} />
      </TouchableOpacity>
    );
  };

  _renderOptionsItem = ({item}: ListRenderItemInfo<SettingsItem>) => {
    let goToPage = () => {
      item.goTo();
      // this.props.navigation.navigate(item.goTo, {previous_scene: 'Profile'});
      this._toggleCollapsible();
    };
    return (
      <TouchableOpacity style={styles.paddedItem} onPress={goToPage}>
        <View style={{flex: 1, paddingRight: 20}}>
          <Text>{item.title}</Text>
        </View>
        <Icon name="chevron-right" color={GREY} style={styles.iconButton} />
      </TouchableOpacity>
    );
  };

  _keyExtractor = (_item: SettingsItem, index: number) => String(index);
}

const styles = StyleSheet.create({
  optionsContainer: {
    paddingTop: 20,
  },
  iconButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  paddedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: LIGHTER_GREY,
  },
  optionsItemContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: LIGHT_GREY,
    marginBottom: 20,
  },
  settingsButton: {
    marginRight: 20,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
});
