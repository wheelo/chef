export default function isReactCompositeComponent(type) {
  if (
    type != null &&
    typeof type === 'function' &&
    type.prototype != null &&
    typeof type.prototype.render === 'function'
  ) {
    return true;
  }
  return false;
}
