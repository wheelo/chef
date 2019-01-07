export default function isReactFunctionalComponent(type) {
  if (
    typeof type === 'function' &&
    (type.prototype == null || !type.prototype.render)
  )
    return true;
  return false;
}
