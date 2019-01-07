export const TokenType = Object.freeze({
  Required: 0,
  Optional: 1
});

function Ref() { }

export class TokenImpl {
  constructor(name, ref) {
    this.name = name;
    this.ref = ref || new Ref();
    // 暂时不使用type
    this.type = ref ? TokenType.Optional : TokenType.Required;
    this.stack = new Error().stack;
    if (!ref) {
      this.optional = new TokenImpl(name, this.ref);
    }
  }
}

export function createToken(name) {
  return ((new TokenImpl(name)));
}
