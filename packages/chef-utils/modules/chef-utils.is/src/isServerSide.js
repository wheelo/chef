export default function isServerSide() {
  return typeof global !== 'undefined' && !global.window;
}
