import React, {Component, createRef} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollViewProps,
  View,
  Image,
} from 'react-native';
import Carousel, {CarouselStatic} from 'react-native-snap-carousel';
import {
  MEDIUM_FONT_SIZE,
  SMALL_FONT_SIZE,
} from '../../../generals/constants/size';
import {Text} from '../../../generals/core-ui';
import {
  WHITE,
  LIGHTER_GREY,
  GREY,
  BLACK,
} from '../../../generals/constants/colors';
import {fire, fireGrey} from '../../../assets/images/dashboard';

export type Intensity = {
  title: string;
  level: IntensityIndexEnum;
  desc: string;
  min: number;
  max: number;
};

export type IntensityIndexEnum = 0 | 1 | 2 | 3;

export type Intensities = Array<Intensity>;

type IntensityItemProps = {
  intensity: Intensity;
  onItemPress: (index: IntensityIndexEnum) => void;
  isSelected: boolean;
};

type Props = {
  intensities: Intensities;
  onValueChange: (index: IntensityIndexEnum) => void;
  selectedIndex: IntensityIndexEnum;
};

export default class IntensityChooser extends Component<Props> {
  _carouselRef = createRef<
    ScrollViewProps & CarouselStatic<number> & Carousel<number>
  >();

  render() {
    let {intensities, onValueChange, selectedIndex} = this.props;
    return (
      <View style={styles.zoneSelectorContainer}>
        <View style={styles.zonesColumnContainer}>
          <IntensityItem
            intensity={intensities[0]}
            onItemPress={onValueChange}
            isSelected={selectedIndex === 0}
          />
        </View>
        <View style={styles.zonesColumnContainer}>
          <IntensityItem
            intensity={intensities[1]}
            onItemPress={onValueChange}
            isSelected={selectedIndex === 1}
          />
          <IntensityItem
            intensity={intensities[2]}
            onItemPress={onValueChange}
            isSelected={selectedIndex === 2}
          />
          {/* <IntensityItem
            intensity={intensities[3]}
            onItemPress={onValueChange}
            isSelected={selectedIndex === 3}
          /> */}
        </View>
      </View>
    );
  }
}

class IntensityItem extends Component<IntensityItemProps> {
  render() {
    let {intensity, isSelected} = this.props;

    let fireImage = [
      intensity.level >= 0 ? true : false,
      intensity.level >= 1 ? true : false,
      intensity.level === 2 ? true : false,
      // intensity.level === 3 ? true : false,
    ];

    let selectedContainerStyle = {
      backgroundColor: WHITE,
    };
    let selectedTitleStyle = {
      color: BLACK,
    };

    return (
      <TouchableOpacity
        style={styles.boxShadow}
        activeOpacity={0.8}
        onPress={this._onPress}
        disabled={isSelected}
      >
        <View style={[styles.zonesItem, isSelected && selectedContainerStyle]}>
          <Text
            fontSize={MEDIUM_FONT_SIZE}
            fontWeight="bold"
            style={[styles.titleStyle, isSelected && selectedTitleStyle]}
          >
            {intensity.title}
          </Text>
          {isSelected && (
            <View>
              <View style={styles.intensityContainer}>
                {fireImage.map((item, index) => (
                  <Image
                    source={item ? fire : fireGrey}
                    style={styles.image}
                    resizeMode="contain"
                    key={`${intensity.level}-${index}`}
                  />
                ))}
              </View>
              <Text fontSize={SMALL_FONT_SIZE}>{intensity.desc}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  _onPress = () => {
    let {intensity, onItemPress} = this.props;
    onItemPress && onItemPress(intensity.level);
  };
}

let styles = StyleSheet.create({
  zoneSelectorContainer: {
    position: 'relative',
    top: -25,
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '2%',
  },
  zonesColumnContainer: {
    width: '49%',
  },
  boxShadow: {
    borderRadius: 10,
    shadowColor: '#aaa',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
    marginBottom: 10,
  },
  zonesItem: {
    padding: 20,
    backgroundColor: LIGHTER_GREY,
    borderRadius: 10,
    overflow: 'hidden',
  },
  titleStyle: {
    color: GREY,
  },
  intensityContainer: {flexDirection: 'row', marginBottom: 5},
  image: {width: 18, height: 18, marginBottom: 0, marginRight: 3},
});
