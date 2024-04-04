  /*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const dealerDeck = buildDealerDeck();
const MSG_LOOKUP = {
  null: "Let's Play Blackjack!",
  'T': "It's a Push",
  'P': 'You WIN!!!💰💵',
  'D': 'The House Wins',
  'B': 'You Busted...🤯',
  'PBJ': 'Blackjack! You WIN! 🍗🧇🤑',
  'DBJ': 'Dealer Has Blackjack',
};

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
let msgEl = document.getElementById('msg');
const dealerHandEl = document.getElementById('dealer-hand');
const dealerTotalEl = document.getElementById('dealer-total');
const playerHandEl = document.getElementById('player-hand');
const playerTotalEl = document.getElementById('player-total');
const betEl = document.getElementById('bet');
const bankAmtEl = document.getElementById('bankAmt');
const playerControlsEl = document.getElementById('player-controls');
const handControlsEl = document.getElementById('hand-controls');
const dealBtn = document.getElementById('deal-btn');
const betBtns = document.querySelectorAll('#bet-controls > button');
const resetBtn = document.getElementById('reset-bet');
const dblBtn = document.getElementById('double-btn');
const replayBtn = document.getElementById('replay-btn')

  /*----- event listeners -----*/
dealBtn.addEventListener('click', handleDeal);
document.getElementById('hit-btn').addEventListener('click', handleHit);
document.getElementById('stand-btn').addEventListener('click', handleStand);
dblBtn.addEventListener('click', handleDouble);
document.getElementById('bet-controls').addEventListener('click', handleBet);
resetBtn.addEventListener('click', resetBet);
document.getElementById('bet-controls').addEventListener('contextmenu', handleDecreaseBet);
replayBtn.addEventListener('click', init);

/*----- functions -----*/
init();

function resetBet(evt) {
  bankAmt += bet;
  bet = 0;
  render();
}

function handleDecreaseBet(evt) {
  evt.preventDefault();
  const btn = evt.target;
  if (btn.tagName !== 'BUTTON') return;
  const betAmt = parseInt(btn.innerText.replace('$', ''));
  bet -= betAmt;
  bankAmt += betAmt;
}

function handleHit() {
  pHand.push(deck.pop());
  pTotal = getHandTotal(pHand);
  dblBtn.style.visibility = 'hidden';
  if (pTotal > 21) {
    outcome = "B";
    settleBet();
  }  
  render();
}

function handleStand() {
  dealerPlay();
  if (pTotal === dTotal) {
    outcome = 'T';
  } else if (dTotal > pTotal && dTotal <= 21) {
    outcome = 'D';
  } else if (pTotal > 21) {
    outcome = 'B';  
  } else {
    outcome = 'P';
  }
  settleBet();
  render();
}

function dealerPlay() {
  while (dTotal < 17) {
    dHand.push(deck.pop());
    dTotal = getHandTotal(dHand);
  }
}

function handleDouble() {
  if ((bet * 2) > bankAmt) {
    msgEl.innerHTML = 'Inusfficient Funds...😭';
    return;
  } else {
    bankAmt = (bankAmt - bet);
    (bet *= 2);
    pHand.push(deck.pop());
    pTotal = getHandTotal(pHand);
    if (pTotal > 21) {
      outcome = 'B';
      bet = 0;
    } else {
      handleStand();
    }
  }  
    render();
  }

function settleBet() {
  if (outcome === 'PBJ') {
    bankAmt += bet + (bet * 1.5);
  } else if (outcome === 'P') {
    bankAmt += bet + bet; 
  } else if (outcome === 'T') {
    bankAmt += bet;
  }
  bet = 0;
}

function handleDeal() {
  outcome = null;
  deck = getNewShuffledDeck();
  dHand = [];
  pHand = [];
  dHand = [deck.pop(), deck.pop()];
  pHand = [deck.pop(), deck.pop()];
  dTotal = getHandTotal(dHand);
  pTotal = getHandTotal(pHand);
  if (dTotal === 21 && pTotal === 21) {
    outcome = 'T'; 
  } else if (dTotal === 21) {
    outcome = 'DBJ'; 
  } else if (pTotal === 21) {
    outcome = 'PBJ'; 
  } if (outcome) settleBet();
  render();
}

function handleBet(evt) {
  const btn = evt.target;
  if (btn.tagName !== 'BUTTON') return;
  const betAmt = parseInt(btn.innerText.replace('$', ''));
  bet += betAmt;
  bankAmt -= betAmt;
  render();
}

function getHandTotal(hand) {
  let total = 0;
  let aces = 0;
  hand.forEach(function(card) {
    total += card.value;
    if (card.value === 11) aces++;
  });
  while (total > 21 && aces) {
    total -= 10;
    aces--;
  }
  return total;
}
//Initialize state, then call render()
function init() {
  outcome = null;
  pHand = [];
  dHand = [];
  pTotal = dTotal = 0;
  bankAmt = 1000;
  bet = 0;
  render();
}

//Visualize all state to the DOM
function render() {
  renderHands() ;
  bankAmtEl.innerHTML = bankAmt;
  betEl.innerHTML = bet;
  renderControls();
  renderBetBtns();
  msgEl.innerHTML = MSG_LOOKUP[outcome];
}

function renderBetBtns() {
  betBtns.forEach(function(btn) {
    const btnAmt = parseInt(btn.innerText.replace('$', ''));
    btn.disabled = btnAmt > bankAmt;
  });
}

function renderControls() {
  handControlsEl.style.visibility = handInPlay() ? 'hidden' : 'visible';
  playerControlsEl.style.visibility = handInPlay() ? 'visible' : 'hidden';
  dealBtn.style.visibility = bet >= 5 && !handInPlay() ? 'visible' : 'hidden';
  resetBtn.style.visibility = bet >= 5 && !handInPlay() ? 'visible' : 'hidden';
  replayBtn.style.visibility = bet === 0 && bankAmt === 0 && !handInPlay() ? 'visible' : 'hidden';

}

function renderHands() {
  playerTotalEl.innerHTML = pTotal;
  dealerTotalEl.innerHTML = outcome ? dTotal : '??';
  playerHandEl.innerHTML = pHand.map(card => `<div class="card ${card.face}"></div>`).join('');
  dealerHandEl.innerHTML = dHand.map((card, idx) => `<div class="card ${idx === 1 && !outcome ? 'back' : card.face}"></div>`).join('');
}

function handInPlay() {
  return pHand.length && !outcome;
}

function getNewShuffledDeck() {
  const tempDeck = [...dealerDeck];
  const getNewShuffledDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    getNewShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return getNewShuffledDeck;
}

function buildDealerDeck() {
  const deck = [];
   suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      deck.push({
        face: `${suit}${rank}`,
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}