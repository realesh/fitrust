import React, {Component, PureComponent, createRef} from 'react';
import {
  StyleSheet,
  ListRenderItemInfo,
  TouchableOpacity,
  ScrollViewProps,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Carousel, {CarouselStatic} from 'react-native-snap-carousel';
import {SCREEN_WIDTH} from '../../../generals/constants/size';
import {Text} from '../../../generals/core-ui';
import {BLUE, WHITE, WHITE60} from '../../../generals/constants/colors';
import {Feather as Icon} from '@expo/vector-icons';

type DurationItemProps = {
  index: number;
  isSelected: boolean;
  duration: number;
  onPress: (index: number) => void;
};

type Props = {
  /**
   * Callback called when the selected duration changed.
   */
  onDurationChange: (index: number) => void;
  /**
   * Index of the selected duration.
   */
  selectedDurationIndex: number;
  /**
   * List of the durations to show.
   */
  durations: Array<number>;
  /**
   * optional style for the chooser container
   */
  containerStyle?: StyleProp<ViewStyle>;
};

export default class DurationChooser extends Component<Props> {
  _carouselRef = createRef<
    ScrollViewProps & CarouselStatic<number> & Carousel<number>
  >();

  render() {
    let {
      onDurationChange,
      durations,
      selectedDurationIndex,
      containerStyle,
    } = this.props;
    return (
      <Carousel
        ref={this._carouselRef}
        data={durations}
        firstItem={selectedDurationIndex}
        renderItem={this._renderItem}
        itemWidth={128}
        sliderWidth={SCREEN_WIDTH}
        containerCustomStyle={[styles.root, containerStyle]}
        inactiveSlideScale={0.8}
        onSnapToItem={onDurationChange}
        removeClippedSubviews={false}
      />
    );
  }

  _renderItem = ({item, index}: ListRenderItemInfo<number>) => {
    let {selectedDurationIndex} = this.props;
    return (
      <DurationItem
        index={index}
        isSelected={selectedDurationIndex === index}
        onPress={this._onDurationPress}
        duration={item}
      />
    );
  };

  _onDurationPress = (index: number) => {
    if (this._carouselRef.current) {
      let {currentIndex} = this._carouselRef.current;
      if (currentIndex !== index) {
        this._carouselRef.current.snapToItem(index);
      }
    }
  };
}

class DurationItem extends PureComponent<DurationItemProps> {
  render() {
    let {isSelected, duration} = this.props;
    return (
      <TouchableOpacity
        disabled={isSelected}
        activeOpacity={0.6}
        style={[styles.durationRoot, isSelected && styles.durationRootSelected]}
        onPress={this._onPress}
      >
        <Text
          fontSize={40}
          fontWeight="bold"
          style={isSelected ? styles.durationTextSelected : styles.durationText}
        >
          {String(duration)}
        </Text>
        <Text
          fontSize={20}
          style={isSelected ? styles.durationTextSelected : styles.durationText}
        >
          mins
        </Text>

        {isSelected && (
          <View style={styles.checkIconContainer}>
            <Icon name="zap" size={25} color={BLUE} />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  _onPress = () => {
    let {index, onPress} = this.props;
    onPress(index);
  };
}

let styles = StyleSheet.create({
  root: {
    maxHeight: 128,
  },
  durationRoot: {
    width: 120,
    height: 120,
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: WHITE60,
    borderWidth: 3,
  },
  durationRootSelected: {
    borderColor: WHITE,
  },
  durationText: {
    color: WHITE60,
  },
  durationTextSelected: {
    color: WHITE,
  },
  checkIconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 35,
    bottom: 0,
    right: 0,
    borderRadius: 17.5,
    backgroundColor: WHITE,
  },
});
