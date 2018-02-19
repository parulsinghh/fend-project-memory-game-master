/*
 * Initialize game states
*/

const cards = [];
let moves = 0;
let startTime = new Date().getTime();
let openCards = [];

/* Get document node by id */
const getDOMNodeById = id => document.getElementById(id);

const duplicateElements = (array, times) =>
  array.reduce((res, current) => res.concat(Array(times).fill(current)), []);

/* Get deck DOM node */
const deckNode = getDOMNodeById('deck');

/* Get moves node */
const movesNode = getDOMNodeById('moves');

/* Get reset node */
const resetNode = getDOMNodeById('reset');

/* Get stars node */
const starsNode = getDOMNodeById('stars');

/* Get timer node */
const timerNode = getDOMNodeById('timer')

let stars = duplicateElements(['star'], 3);

/* All card types */
const cardTypes = duplicateElements([
  'diamond',
  'paper-plane-o',
  'anchor',
  'bolt',
  'cube',
  'leaf',
  'bicycle',
  'bomb'
], 2);

/* Creates a card element */
const createElement = (className) => {
  const cardElement = document.createElement('li');
  cardElement.className =  `card ${className}`;
  
  const icon = document.createElement('i');
  icon.className = `fa fa-${className}`;
  
  cardElement.appendChild(icon);
  return cardElement;
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }

  return array;
};

const openCard = (card) => {
  card.element.classList.add('open', 'show');
  card.shown = true;
  openCards.push(card);
};

const matchCard = () => {
  moves += 1;
  movesNode.innerHTML = moves;
  
  switch (moves) {
    case 5: 
      stars.pop()
      renderStars()
      break
    case 8: 
      stars.pop()
      renderStars()
      break
    case 10: 
      stars.pop()
      renderStars()
      gameLost()
      break
  }

  const currentOpenCards = openCards.filter(card => card.shown);
  const isMatch = currentOpenCards.every(card => {
    return currentOpenCards[0].type === card.type
  });

  if (isMatch) {
    currentOpenCards.forEach(card => {
      card.element.classList.add('match')
      card.shown = false
      card.match = true
    })

    return 
  }

  lockCards(currentOpenCards)
}

const lockCards = (currentOpenCards) => {
  currentOpenCards.forEach((card, index) => {
    card.locked = true
    card.match = false
    card.shown = false
    card.element.classList.add('unmatch')
    setTimeout(() => {
      card.element.classList.remove('open', 'show', 'unmatch')
    }, 500)
  })

  openCards = openCards.filter(card => !currentOpenCards.includes(card))
}

const canMatch = () => 
  openCards.filter(card => card.shown).length >= 2

const gameFinished = () => 
  openCards.length && 
    cards.length === openCards.length &&
    openCards.every(card => card.match);

const calculateGameTime = () => {
  const endTime = new Date().getTime()
  const distance = endTime - startTime 
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  return `${seconds} seconds`
}

const gameLost = () => 
   swal({
    title: "You lost!",
    text: `You took ${calculateGameTime()}, ${moves} moves and used all your stars`,
    icon: "warning",
    button: "Play again!"
  }).then((value) => {
    resetGame();
  });

// Check game status on each click
const showScoreCard = () => {
  swal({
    title: "Congratulations! You won!",
    text: `You took ${calculateGameTime()}, ${moves} moves and used ${stars} stars`,
    icon: "success",
    button: "Play again!"
  }).then((value) => {
    resetGame();
  });
}

const revealCard = (e, card) => {
  e.preventDefault()
  if (card.shown) return 
  if (openCards.includes(card)) return
    
  openCard(card)
  if (canMatch()) matchCard()
  if (gameFinished()) showScoreCard()
}

const timeToSeconds = (time) => 
  Math.floor((time % (1000 * 60)) / 1000)

const startTimer = () => 
  setInterval(() => {
    const now = new Date().getTime()
    const distance = now - startTime
    timerNode.innerHTML = `${timeToSeconds(distance)}s`
  }, 1000)

const renderStars = () => {
   starsNode.innerHTML = null
   stars.forEach(star => {
    const element = createElement(star)
    starsNode.appendChild(element);
  })
}

// Render game board
const renderGame = () => {
  deckNode.innerHTML = null
  startTime = new Date().getTime()

  cardTypes.forEach((type, index) => {
    const element = createElement(type);
    const cardAttrs = {
      index,
      type,
      element,
      match: false,
      shown: false,
      locked: false
    };

    element.addEventListener('click', (e) => revealCard(e, cardAttrs));
    cards.push(cardAttrs);
    deckNode.appendChild(element);
  })

  renderStars()
  startTimer()
};

/* Resets game */
const resetGame = () => {
  openCards = []
  moves = 0
  stars = duplicateElements(['star'], 3)
  movesNode.innerHTML = 0
  renderGame()
}

// Initialize and render game
document.addEventListener('DOMContentLoaded', renderGame)
resetNode.addEventListener('click', resetGame)

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
