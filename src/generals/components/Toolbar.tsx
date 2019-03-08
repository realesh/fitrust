import React, {ReactNode} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {NavigationScreenProps} from 'react-navigation';
import {Feather as Icon} from '@expo/vector-icons';
import {DEFAULT_TEXT_COLOR, WHITE} from '../constants/colors';
import {HEADER_FONT_SIZE} from '../constants/size';

type Props = NavigationScreenProps & {
  /**
   * header text to be displayed on toolbar
   */
  title?: string;

  /**
   * ReactNode (Icon) to display on left side of toolbar
   */
  leftComponent?: ReactNode;

  /**
   * ReactNode (Icon) to display on right side of toolbar
   */
  rightComponent?: ReactNode;

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
    rightComponent,
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
      {rightComponent ? rightComponent : null}
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
    fontSize: HEADER_FONT_SIZE,
    fontFamily: 'Lato-Bold',
  },
});
