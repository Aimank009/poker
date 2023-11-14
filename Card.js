"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function actualValueOf(value) {
    const values = {
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
class Card {
    constructor(suit, cardFace, value = actualValueOf(cardFace).toString()) {
        this.suit = suit;
        this.cardFace = cardFace;
        this.value = value;
    }
    toString() {
        return `${this.cardFace}${this.suit.charAt(0).toLowerCase()}`;
    }
}
exports.default = Card;
