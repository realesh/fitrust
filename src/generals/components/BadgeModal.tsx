import React from 'react';
import {StyleSheet, ModalBaseProps, View, Image} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import PopupDialog from './PopupDialog';
import {Text, Button} from '../core-ui';
import {BLUE, WHITE} from '../constants/colors';
import {LARGE_FONT_SIZE, BIG_FONT_SIZE} from '../constants/size';
import numberFormatter from '../../helpers/numberFormatter';

type Props = ModalBaseProps & {
  imageUrl: string;
  name: string;
  pointsValue: number;
};

export default function BadgeModal(props: Props) {
  let {visible = false, onRequestClose, imageUrl, pointsValue, name} = props;
  return (
    <PopupDialog visible={visible} onRequestClose={onRequestClose}>
      <Image
        source={{uri: imageUrl}}
        style={styles.modalImage}
        resizeMode="contain"
      />
      <View style={styles.pointsContainer}>
        <Icon name="zap" size={30} color={BLUE} style={{marginRight: 10}} />
        <Text fontWeight="bold" fontSize={BIG_FONT_SIZE} style={{color: BLUE}}>
          {numberFormatter(Math.floor(pointsValue))}
        </Text>
      </View>
      <Text fontWeight="bold" fontSize={LARGE_FONT_SIZE}>
        {`Badge unlocked!\n${name}`}
      </Text>
      <Button
        onPress={onRequestClose}
        style={styles.interactButton}
        fontColor={BLUE}
      >
        Got it
      </Button>
    </PopupDialog>
  );
}

const styles = StyleSheet.create({
  paddedContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  modalImage: {
    height: 200,
    width: '100%',
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
  highlight: {color: BLUE},
});
