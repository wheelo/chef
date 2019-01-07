export default function isBrowserSide() {
  return typeof window !== 'undefined' && window.location;
}
