import isServerSide from './isServerSide';
import isBrowserSide from './isBrowserSide';

export default function isReactNative() {
  return !isServerSide() && !isBrowserSide();
}
