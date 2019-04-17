import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {Text} from './';
import {MEDIUM_FONT_SIZE, DEFAULT_ICON_SIZE} from '../constants/size';
import {PopupDialog} from '../components';
import {LIGHT_GREY, WHITE, LIGHTER_GREY, RED} from '../constants/colors';

/**
 * ---
 * Basic Info
 * ---
 * Core UI: Dropdown
 * Description: a selection component which will show a list of options when pressed
 *
 * ---
 * Props
 * ---
 * options: list of available options for the dropdown
 * onValueChange: function to be executed dropdown value is selected
 * titleContent: Object with the shape of Content (refer to Translatable) for the title of the dropdown
 * errorContent: Object with the shape of Content (refer to Translatable) for the error message of the dropdown
 * placeholderContent: Object with the shape of Content (refer to Translatable) for the placeholder of the dropdown
 * selectedValue: selected value of the dropdown
 */

export type onDropdownValueChangeFn = (
  itemValue?: string,
  itemIndex?: number,
) => void;

type Props = {
  options: Array<string>;
  onValueChange: onDropdownValueChangeFn;
  title?: string;
  placeholder?: string;
  selectedValue?: string;
  /**
   * style for the dropdown container
   */
  containerStyle?: StyleProp<ViewStyle>;
  error?: boolean;
};

type State = {
  showPicker: boolean;
};

export default class Dropdown extends Component<Props, State> {
  state: State = {
    showPicker: false,
  };

  render() {
    let {
      options,
      title,
      placeholder,
      onValueChange,
      selectedValue,
      containerStyle,
      error,
    } = this.props;
    let {showPicker} = this.state;

    let borderStyle = {
      borderColor: error ? RED : LIGHT_GREY,
    };
    return (
      <View style={[styles.root, containerStyle]}>
        {title && <Text style={styles.titleText}>{title}</Text>}
        <TouchableOpacity
          onPress={() => this.setState({showPicker: !showPicker})}
          style={[styles.dropdownContainer, borderStyle]}
        >
          <Text style={styles.flex} fontSize={MEDIUM_FONT_SIZE}>
            {selectedValue ? selectedValue : placeholder}
          </Text>
          <Icon name="chevron-down" size={DEFAULT_ICON_SIZE} />
        </TouchableOpacity>

        <PopupDialog
          visible={showPicker}
          onRequestClose={() => this.setState({showPicker: false})}
          containerStyle={{padding: 0}}
        >
          {title && (
            <Text
              fontWeight="bold"
              fontSize={MEDIUM_FONT_SIZE}
              style={styles.title}
            >
              {title}
            </Text>
          )}
          <ScrollView bounces={false} style={{width: '100%'}}>
            {options.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.listItem, index !== 0 && styles.divider]}
                onPress={() => {
                  onValueChange(item, index);
                  this.setState({showPicker: false});
                }}
              >
                <Text fontSize={MEDIUM_FONT_SIZE}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </PopupDialog>
      </View>
    );
  }
}

const BORDER_RADIUS = 2;

const styles = StyleSheet.create({
  dropdownContainer: {
    flex: 2,
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 2,
  },
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  listItem: {height: 45, paddingHorizontal: 30, paddingVertical: 10},
  divider: {borderTopColor: LIGHTER_GREY, borderTopWidth: 1},
  titleText: {flex: 1, marginRight: 10},
  title: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  horizontalMargin: {marginHorizontal: 30},
});
