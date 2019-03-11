import {Dimensions} from 'react-native';

const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} = Dimensions.get('window');
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('screen');

const DEFAULT_ICON_SIZE = 20;

const SMALL_FONT_SIZE = 12;
const DEFAULT_FONT_SIZE = 16;
const MEDIUM_FONT_SIZE = 18;
const LARGE_FONT_SIZE = 24;
const HEADER_FONT_SIZE = 28;
const BIG_FONT_SIZE = 48;

export {
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  DEFAULT_ICON_SIZE,
  DEFAULT_FONT_SIZE,
  SMALL_FONT_SIZE,
  MEDIUM_FONT_SIZE,
  LARGE_FONT_SIZE,
  HEADER_FONT_SIZE,
  BIG_FONT_SIZE,
};
