import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ModalBaseProps,
  AsyncStorage,
} from 'react-native';
import {Text, Button} from '../../../generals/core-ui';
import {
  BLUE,
  LIGHT_GREY,
  LIGHTER_GREY,
  WHITE,
} from '../../../generals/constants/colors';
import {BIG_FONT_SIZE} from '../../../generals/constants/size';
import {PopupDialog} from '../../../generals/components';
import {calcResult} from '../../../assets/images/bmi';
import {bmiScaleList} from '../data/BMIData';
import {Mutation} from 'react-apollo';
import {
  UpdateBMIResponse,
  UpdateBMIVariables,
  UPDATE_BMI,
  USER_PROFILE,
} from '../../../graphql/queries/profile';

type Props = ModalBaseProps & {
  bmiResult: number;
  bmiScaleIndex: number;
  onUpdatePress: () => void;
};

export default function BMIResultModal(props: Props) {
  let {
    visible = false,
    onRequestClose,
    bmiResult,
    bmiScaleIndex,
    onUpdatePress,
  } = props;
  return (
    <Mutation<UpdateBMIResponse, UpdateBMIVariables> mutation={UPDATE_BMI}>
      {(updateUser, {loading}) => {
        let handleUpdate = async () => {
          try {
            let ID = await AsyncStorage.getItem('userID');
            updateUser &&
              (await updateUser({
                variables: {
                  userID: ID || '',
                  bmi: Number.parseInt(bmiResult.toFixed(0), 10),
                },
                refetchQueries: [
                  {
                    query: USER_PROFILE,
                    variables: {
                      userID: ID,
                    },
                  },
                ],
              }));
          } catch (error) {
            // Handle Error
          }
          onUpdatePress();
          onRequestClose && onRequestClose();
        };

        return (
          <PopupDialog
            visible={visible}
            onRequestClose={onRequestClose}
            containerStyle={styles.root}
          >
            <View style={styles.paddedContainer}>
              <Image
                source={calcResult}
                style={styles.modalImage}
                resizeMode="contain"
              />
              <Text fontWeight="bold" fontSize={BIG_FONT_SIZE}>
                {bmiResult.toFixed(0)}
              </Text>
              <Text
                fontWeight="bold"
                style={{color: bmiScaleList[bmiScaleIndex].color}}
              >
                {bmiScaleList[bmiScaleIndex].title}
              </Text>
              <Text style={{lineHeight: 24, textAlign: 'center', marginTop: 5}}>
                {bmiScaleList[bmiScaleIndex].desc}
              </Text>
            </View>

            <View style={styles.footerBtnContainer}>
              <Button
                onPress={onRequestClose}
                style={styles.closeBtn}
                fontColor={BLUE}
              >
                Close
              </Button>
              <Button
                // onPress={onUpdatePress}
                onPress={handleUpdate}
                style={styles.updateBtn}
                fontColor={BLUE}
                disabled={loading}
              >
                Update
              </Button>
            </View>
          </PopupDialog>
        );
      }}
    </Mutation>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 0,
  },
  paddedContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalImage: {
    height: 230,
    width: '100%',
  },
  footerBtnContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: LIGHT_GREY,
  },
  closeBtn: {
    flex: 1,
    backgroundColor: WHITE,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 0,
  },
  updateBtn: {
    flex: 1,
    backgroundColor: LIGHTER_GREY,
    paddingVertical: 15,
    borderRadius: 0,
  },
});
