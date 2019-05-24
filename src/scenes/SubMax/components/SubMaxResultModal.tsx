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
  GREY,
} from '../../../generals/constants/colors';
import {BIG_FONT_SIZE} from '../../../generals/constants/size';
import {PopupDialog} from '../../../generals/components';
import {calcResult} from '../../../assets/images/bmi';
import {Mutation} from 'react-apollo';
import {
  UPDATE_MHR,
  UpdateMHRResponse,
  UpdateMHRVariables,
} from '../../../graphql/mutations/subMaxTest';
import {USER_PROFILE} from '../../../graphql/queries/profile';
import {USER_COUPONS} from '../../../graphql/mutations/exerciseMode';

type Props = ModalBaseProps & {
  subMaxResult: number;
  onUpdatePress: () => void;
};

export default function SubMaxResultModal(props: Props) {
  let {visible = false, onRequestClose, subMaxResult, onUpdatePress} = props;
  return (
    <Mutation<UpdateMHRResponse, UpdateMHRVariables> mutation={UPDATE_MHR}>
      {(updateUser, {loading}) => {
        let handleUpdate = async () => {
          try {
            let ID = await AsyncStorage.getItem('userID');
            updateUser &&
              (await updateUser({
                variables: {
                  userID: ID || '',
                  mhr: Number.parseInt(subMaxResult.toFixed(0), 10),
                },
                refetchQueries: [
                  {
                    query: USER_PROFILE,
                    variables: {
                      userID: ID,
                    },
                  },
                  {
                    query: USER_COUPONS,
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
                {subMaxResult.toFixed(0)}
              </Text>
              <Text fontWeight="bold" style={{color: GREY}}>
                BPM
              </Text>
              <Text style={{lineHeight: 24, textAlign: 'center', marginTop: 5}}>
                {
                  'The higher your score the better your fitness level are.\nTry to eat healthier and get more workout to gain better results in MHR'
                }
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
