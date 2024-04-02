  /*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const dealerDeck = buildDealerDeck();


  /*----- state variables -----*/
let deck;
let pHand; 
let dHand;
let pTotal; 
let dTotal;
let bankAmt;
let bet;
let outcome;

  /*----- cached elements  -----*/
const msgEl = document.getElementById('msg');
const dealerHandEl = document.getElementById('dealer-hand');
const dealerTotalEl = document.getElementById('dealer-total');
const playerHandEl = document.getElementById('player-hand');
const playerTotalEl = document.getElementById('player-total');
const betEl = document.getElementById('bet');
const bankrollEl = document.getElementById('bankroll');
const playerControlsEl = document.getElementById('player-controls');
const handControlsEl = document.getElementById('hand-controls');
const dealBtn = document.getElementById('deal-btn');

  /*----- event listeners -----*/
dealBtn.addEventListener('click', handleDeal);
document.getElementById('hit-btn').addEventListener('click', handleHit);
document.getElementById('stand-btn').addEventListener('click', handleStand);
document.getElementById('double-btn').addEventListener('click', handleDouble);
document.getElementById('bet-controls').addEventListener('click', handleBet);

  /*----- functions -----*/
init();

function init() {
  outcome = null;
  pHand = [];
  dHand = [];
  pTotal = dTotal = 0
  bankAmt = 1000
  bet = 0
}

function handleDeal() {
  outcome = null;
  deck = getNewShuffledDeck();
  dHand = [deck.pop(), deck.pop()];
  pHand = [deck.pop(), deck.pop()];
  // Check for blackjack
  dTotal = getHandTotal(dHand);
  pTotal = getHandTotal(pHand);
  if (dTotal === 21 && pTotal === 21) {
    outcome = 'T'; // Hand is a push/tie
  } else if (dTotal === 21) {
    outcome = 'DBJ'; // Dealer wins with BJ
  } else if (pTotal === 21) {
    outcome = 'PBJ'; // Player wins with BJ
  }
  if (outcome) settleBet();
  render();
}

function handleBet(evt) {

}

function handleHit() {

}
 
function handleStand() {

}

function handleDouble() {

}
function render() {

}

function renderBetBtns() {

}

function renderControls() {

}

function renderHands() {

}

function handInPlay() {

}

function getNewShuffledDeck() {

}