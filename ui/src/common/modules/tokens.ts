export type Token = {
  id: string;
  number: string;
  collection: string;
  collectionName: string;
  name: string;
  description: string;
  metaUrl: string;
  imageUrl: string;
  ogImageUrl: string;
  type: Token.Type;
  wallet: string;
  permalink: string;
  traits: Token.Trait[];
}

export namespace Token {
  export type Type = "VIDEO" | "IMAGE" | "";

  export type Trait = {
    type: string;
    value: string;
  };
}

export namespace Tokens {
  export function getName(token: Token) {
    return token.name.trim()
  }

  export function getOpenSeaUrl(token: Token): string {
    return token.permalink || `https://opensea.io/assets/${token.collection}/${token.number}`
  }
}
