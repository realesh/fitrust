import {avatarStocks} from '../assets/images/profile/avatars';
import {ImageSourcePropType} from 'react-native';

export function imageResolvers(uri: string): ImageSourcePropType {
  let parsedUri = Number.parseInt(uri, 10);
  if (Number.isInteger(parsedUri)) {
    return avatarStocks[parsedUri];
  } else {
    return {uri: uri ? uri : 'https://i.imgur.com/herOTsM.png'};
  }
}
