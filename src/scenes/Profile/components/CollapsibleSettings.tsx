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
import {
  GREY,
  LIGHT_GREY,
  LIGHTER_GREY,
} from '../../../generals/constants/colors';
import {
  LARGE_FONT_SIZE,
  SMALL_FONT_SIZE,
  SCREEN_HEIGHT,
} from '../../../generals/constants/size';
import {linearEasingShort} from '../../../generals/constants/animationConfig';
import {SettingsItem} from '../data/settingsDataFixtures';
import {NavigationScreenProps} from 'react-navigation';

type Props = NavigationScreenProps & {
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
          />
        </View>
      </View>
    );
  }

  _toggleCollapsible = () => {
    LayoutAnimation.configureNext(linearEasingShort);
    this.setState({collapsed: !this.state.collapsed});
  };

  _renderOptionsItem = ({item}: ListRenderItemInfo<SettingsItem>) => {
    let goToPage = () => {
      this.props.navigation.navigate(item.goTo, {previous_scene: 'Profile'});
    };
    return (
      <TouchableOpacity style={styles.paddedItem} onPress={goToPage}>
        <View style={{flex: 1, paddingRight: 20}}>
          <Text>{item.title}</Text>
          <Text fontSize={SMALL_FONT_SIZE} style={{color: GREY, marginTop: 5}}>
            {item.subtitle}
          </Text>
        </View>
        <Button
          iconName="chevron-right"
          fontColor={GREY}
          style={styles.iconButton}
        />
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
