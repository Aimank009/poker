export type Suit = "Hearts" | "Diamonds" | "Clubs" | "Spades";
export type Value =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

function actualValueOf(value: Value): number {
  const values: Record<Value, number> = {
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4,
    "6": 5,
    "7": 6,
    "8": 7,
    "9": 8,
    "10": 9,
    J: 10,
    Q: 11,
    K: 12,
    A: 13,
  };

  return values[value];
}

export default class Card {
  constructor(
    public suit: Suit,
    public cardFace: Value,
    public value: string = actualValueOf(cardFace).toString()
  ) {}

  toString(): string {
    return `${this.cardFace}${this.suit.charAt(0).toLowerCase()}`;
  }
}
