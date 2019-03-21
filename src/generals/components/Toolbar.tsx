import React, {ReactNode} from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Feather as Icon} from '@expo/vector-icons';
import {DEFAULT_TEXT_COLOR, WHITE, BLUE} from '../constants/colors';
import {
  HEADER_FONT_SIZE,
  MEDIUM_FONT_SIZE,
  LARGE_FONT_SIZE,
} from '../constants/size';
import {Text} from '../core-ui';

type Props = NavigationScreenProps & {
  /**
   * header text to be displayed on toolbar
   */
  title?: string;

  /**
   * ReactNode (Icon) to display on left side of toolbar
   */
  leftComponent?: ReactNode;
  pointsInfo?: boolean;

  /**
   * optional style for the title
   */
  titleStyle?: StyleProp<TextStyle>;

  /**
   * optional style for the toolbar container
   */
  containerStyle?: StyleProp<ViewStyle>;
};

function Toolbar(props: Props) {
  let {
    containerStyle,
    leftComponent,
    pointsInfo = false,
    title,
    titleStyle,
    navigation,
  } = props;
  let canGoBack: boolean =
    (navigation.state.params && navigation.state.params.previous_scene) ||
    false;

  let goBack = () => navigation.goBack();
  return (
    <View style={[styles.toolbarContainer, containerStyle]}>
      {leftComponent ? (
        leftComponent
      ) : canGoBack ? (
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
      ) : null}

      {title ? (
        <Text style={[styles.headerText, titleStyle]}>{title}</Text>
      ) : null}

      {pointsInfo ? (
        <View style={styles.rightComponent}>
          <TouchableOpacity style={styles.levelPointsContainer}>
            <View style={styles.levelInfoContainer}>
              <Icon name="zap" size={MEDIUM_FONT_SIZE} color={WHITE} />
            </View>
            <View style={styles.pointsInfoContainer}>
              <Text fontWeight="bold" style={{color: BLUE}}>
                2,517
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

export default Toolbar;

const styles = StyleSheet.create({
  toolbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: WHITE,
  },
  headerText: {
    color: DEFAULT_TEXT_COLOR,
    fontSize: LARGE_FONT_SIZE,
    fontFamily: 'Lato-Bold',
    marginLeft: 10,
  },
  rightComponent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  levelPointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: BLUE,
  },
  pointsInfoContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
