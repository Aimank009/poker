"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(initialStack, name) {
        this.name = "";
        this.hand = [];
        this.currentBet = 0;
        this.cards = [];
        this.showDownHand = {
            hand: [],
            descendingSortHand: [],
        };
        this.chips = 20000;
        this.roundStartChips = 20000;
        this.roundEndChips = 20000;
        this.currentRoundChipsInvested = 0;
        this.bet = 0;
        this.betReconciled = false;
        this.folded = false;
        this.allIn = false;
        this.canRaise = true;
        this.stackInvestment = 0;
        this.robot = false;
        this.name = name;
        this.stack = initialStack;
    }
    clearHand() {
        this.hand = [];
        this.currentBet = 0;
    }
    takeCard(card) {
        this.hand.push(card.value + card.suit.charAt(0).toLocaleLowerCase());
        this.cards.push(card);
    }
    betAmount(amount) {
        if (amount <= 0) {
            throw new Error("Bet amount must be positive.");
        }
        if (amount >= this.stack) {
            this.playerAllIn();
        }
        else {
            this.currentBet = amount;
            this.stack -= amount;
        }
        console.log(this.name + " bets " + amount);
    }
    raise(amount) {
        if (amount <= 0) {
            throw new Error("Raise amount must be positive.");
        }
        const totalBet = this.currentBet + amount;
        if (totalBet >= this.stack) {
            this.playerAllIn();
        }
        else {
            this.stack -= amount;
            this.currentBet = totalBet;
        }
        console.log(this.name + " raises to " + amount);
    }
    call(currentRoundBet) {
        const amountToCall = currentRoundBet - this.currentBet;
        if (amountToCall > this.stack) {
            this.playerAllIn();
        }
        else {
            this.currentBet += amountToCall;
            this.stack -= amountToCall;
        }
        console.log(this.name + " calls " + currentRoundBet);
    }
    check(currentRoundBet) {
        if (this.currentBet < currentRoundBet) {
            throw new Error("Cannot check: there is a bet in the current round.");
        }
        console.log(this.name + " checks ");
    }
    playerAllIn() {
        this.currentBet += this.stack;
        this.stack = 0;
        console.log(this.name + " goes all in");
    }
    fold() {
        this.hand = [];
        console.log(this.name + " folds");
    }
    credit(amount) {
        this.stack += amount;
    }
}
exports.default = Player;
