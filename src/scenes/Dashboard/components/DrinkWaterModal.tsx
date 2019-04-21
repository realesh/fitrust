import React, {Component} from 'react';
import {
  StyleSheet,
  ModalBaseProps,
  View,
  Image,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
} from 'react-native';
import {Text, Button} from '../../../generals/core-ui';
import {BLUE, WHITE, BLUE30} from '../../../generals/constants/colors';
import {PopupDialog} from '../../../generals/components';
import {LARGE_FONT_SIZE} from '../../../generals/constants/size';
import {waterActive, waterInactive} from '../../../assets/images/dashboard';

type State = {
  waterValue: number;
};

type Props = ModalBaseProps & {
  onAddPress: (value: number) => void;
};

export default class DrinkWaterModal extends Component<Props, State> {
  state = {
    waterValue: 1,
  };

  render() {
    let {waterValue} = this.state;
    let {visible = false, onRequestClose} = this.props;

    let listData = Array.from(Array(8), (_, x) => x);
    return (
      <PopupDialog visible={visible} onRequestClose={onRequestClose}>
        <View style={styles.flexRow}>
          <Text style={{flex: 1}}>How much water did you drink?</Text>
          <Text
            fontWeight="bold"
            fontSize={LARGE_FONT_SIZE}
            style={styles.valIndicatorText}
          >
            {waterValue}
          </Text>
        </View>
        <View style={[styles.flexRow, {marginTop: 20}]}>
          <FlatList
            data={listData}
            renderItem={this._renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={this._keyExtractor}
            horizontal={true}
          />
        </View>
        <Button
          onPress={this._onClosePress}
          style={styles.interactButton}
          fontColor={BLUE}
        >
          Add Glasses
        </Button>
      </PopupDialog>
    );
  }

  _renderItem = ({item}: ListRenderItemInfo<number>) => {
    let {waterValue} = this.state;
    let onPress = () => this.setState({waterValue: item + 1});
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        <Image
          source={item + 1 <= waterValue ? waterActive : waterInactive}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };
  _keyExtractor = (_item: number, index: number) => String(index);
  _onClosePress = () => this.props.onAddPress(this.state.waterValue);
}

const styles = StyleSheet.create({
  flexRow: {flexDirection: 'row', width: '100%'},
  paddedContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  image: {
    height: 32,
    width: 32,
  },
  interactButton: {
    backgroundColor: WHITE,
    marginTop: 20,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BLUE,
    width: '90%',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    backgroundColor: BLUE30,
  },
  valIndicatorText: {
    flex: 1,
    alignSelf: 'flex-end',
    textAlign: 'right',
    color: BLUE,
  },
});
