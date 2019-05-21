import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  ImageRequireSource,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Toolbar} from '../../generals/components';
import {WHITE} from '../../generals/constants/colors';
import {avatarStocks} from '../../assets/images/profile/avatars';

type NavigationScreenParams = {
  setTempAvatar: (index: number) => void;
};

type Props = NavigationScreenProps<NavigationScreenParams>;

type State = {
  minimizeHeader: boolean;
};

export default class AvatarSelectorScene extends Component<Props, State> {
  state: State = {
    minimizeHeader: false,
  };

  offset = 0;

  render() {
    let {navigation} = this.props;

    return (
      <View style={styles.root}>
        <Toolbar navigation={navigation} title="Avatars" />
        <View style={styles.contentContainer}>
          <FlatList
            data={avatarStocks}
            renderItem={this._renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={this._keyExtractor}
            numColumns={3}
            columnWrapperStyle={{paddingHorizontal: 10, marginBottom: 10}}
          />
        </View>
      </View>
    );
  }

  _renderItem = ({
    item,
    index,
  }: ListRenderItemInfo<Partial<ImageRequireSource>>) => {
    let avatarStyle: StyleProp<ViewStyle> = {
      flex: 1,
      aspectRatio: 1,
      borderRadius: 10,
      marginRight: (index + 1) % 3 === 0 ? 0 : 10,
      overflow: 'hidden',
    };
    let onPress = () => {
      this.props.navigation.getParam('setTempAvatar')(index);
      this.props.navigation.goBack();
    };
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={avatarStyle}
        onPress={onPress}
      >
        <Image source={item} style={styles.imageStyle} />
      </TouchableOpacity>
    );
  };

  _keyExtractor = (_item: ImageRequireSource, index: number) => String(index);
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
  imageStyle: {
    height: '100%',
    width: '100%',
  },
});
