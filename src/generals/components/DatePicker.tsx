import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  DatePickerAndroid,
  DatePickerIOS,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Button, TextInput} from '../../generals/core-ui';
import {MEDIUM_FONT_SIZE} from '../../generals/constants/size';
import {BLACK, LIGHT_GREY, WHITE, BLUE} from '../../generals/constants/colors';
import {PopupDialog} from '../../generals/components';

type Props = {
  onDateChange: (value: Date) => void;
  value: Date;
  containerStyle?: StyleProp<ViewStyle>;
};

export default class DatePicker extends Component<Props> {
  state = {
    datePickerIOSModalVisible: false,
  };

  render() {
    let {datePickerIOSModalVisible} = this.state;
    let {value, containerStyle} = this.props;
    return (
      <TouchableOpacity
        onPress={this._onDatePick}
        style={[styles.container, containerStyle]}
      >
        <TextInput
          iconName="calendar"
          label="Date of Birth"
          value={value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
          selectionColor={LIGHT_GREY}
          disabled={true}
          validate={false}
        />
        <PopupDialog visible={datePickerIOSModalVisible}>
          <DatePickerIOS
            date={value}
            onDateChange={this._inIOSDatePick}
            style={{width: '100%'}}
            mode="date"
            maximumDate={new Date()}
          />
          <Button
            onPress={this._toggleModalVisible}
            style={styles.interactButton}
            fontColor={BLUE}
          >
            OK
          </Button>
        </PopupDialog>
      </TouchableOpacity>
    );
  }

  _onDatePick = async () => {
    let {onDateChange} = this.props;
    if (Platform.OS === 'ios') {
      this._toggleModalVisible();
    } else if (Platform.OS === 'android') {
      try {
        const result = await DatePickerAndroid.open({
          date: new Date(),
          mode: 'spinner',
          maxDate: new Date(),
        });
        if (result.action === 'dateSetAction') {
          let {year, month, day} = result;
          let date = new Date(year, month, day);
          onDateChange(date);
        }
      } catch (error) {
        // Handle ERROR
      }
    }
  };
  _inIOSDatePick = (date: Date) => {
    this.props.onDateChange(date);
  };

  _toggleModalVisible = () => {
    this.setState({
      datePickerIOSModalVisible: !this.state.datePickerIOSModalVisible,
    });
  };
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textInput: {
    height: 20,
    fontSize: MEDIUM_FONT_SIZE,
    flex: 1,
    color: BLACK,
    fontFamily: 'Lato-Regular',
  },
  interactButton: {
    backgroundColor: WHITE,
    marginTop: 10,
    height: 40,
    borderWidth: 0,
  },
});
