/* Initialize game states */
const cards = [];
let moves = 0;
let startTime = new Date().getTime();
let openCards = [];

/* Get document node by id */
const getDOMNodeById = id => document.getElementById(id);

/* Duplicate array items */
const duplicateElements = (array, times) =>
  array.reduce((acc, current) => acc.concat(Array(times).fill(current)), []);

/* Get deck DOM node */
const deckNode = getDOMNodeById('deck');

/* Get moves node */
const movesNode = getDOMNodeById('moves');

/* Get reset node */
const resetNode = getDOMNodeById('reset');

/* Get stars node */
const starsNode = getDOMNodeById('stars');

/* Get timer node */
const timerNode = getDOMNodeById('timer');

/* Initialize 3 stars */
let stars = duplicateElements(['star'], 3);

/* Declare all card types and duplicate */
const cardTypes = duplicateElements(
  [
    'diamond',
    'paper-plane-o',
    'anchor',
    'bolt',
    'cube',
    'leaf',
    'bicycle',
    'bomb'
  ],
  2
);

/* Create a dom element given element name and a class name */
const createElement = (element, className = '') => {
  const cardElement = document.createElement(element);
  cardElement.className = className;
  return cardElement;
};

/* Creates a card element given a class name */
const createCard = className => {
  const cardElement = createElement('li', `card ${className}`);
  const iconElement = createElement('i', `fa fa-${className}`);

  cardElement.appendChild(iconElement);
  return cardElement;
};

// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = array => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

/* Resets game */
const resetGame = () => {
  openCards = [];
  moves = 0;
  stars = duplicateElements(['star'], 3);
  movesNode.innerHTML = 0;
  renderGame();
};

/* Add a event listener to reset icon */
resetNode.addEventListener('click', resetGame);

const statusText = () => 
  `You took ${calculateGameTime()}, ${moves} moves and have ${stars.length} stars left`

/* Renders game lost popup if all stars have been used */
const gameLost = () =>
  swal({
    title: 'You lost!',
    text: statusText(),
    icon: 'warning',
    button: 'Play again!'
  }).then(() => resetGame());

/* Renders a final score card popup when game is finished */
const showScoreCard = () => {
  swal({
    title: 'Congratulations! You won!',
    text: statusText(),
    icon: 'success',
    button: 'Play again!'
  }).then(() => resetGame());
};

/* Adds a card to list of open cards when clicked */
const openCard = card => {
  card.element.classList.add('open', 'show');
  card.shown = true;
  openCards.push(card);
};

/* Updates moves counter */
const updateMoves = () => {
  moves += 1;
  movesNode.innerHTML = moves;
};

/* Updates stars list */
const updateStars = () => {
  switch (moves) {
    case 12:
      stars.pop();
      renderStars();
      break;
    case 24:
      stars.pop();
      renderStars();
      break;
    case 36:
      stars.pop();
      renderStars();
      gameLost();
      break;
  }
};

/* Matches two open cards currently in open cards */
const matchCard = () => {
  updateMoves();
  updateStars();

  /* Get a list of current open cards */
  const currentOpenCards = openCards.filter(card => card.shown);

  /* Check to see if both open cards match */
  const isMatch = currentOpenCards.every(
    card => currentOpenCards[0].type === card.type
  );

  if (isMatch) {
    currentOpenCards.forEach(card => {
      card.element.classList.add('match');
      card.shown = false;
      card.match = true;
    });

    return;
  }

  lockCards(currentOpenCards);
};

/* Locks current open cards if they don't match */
const lockCards = (currentOpenCards) => {
  currentOpenCards.forEach((card, index) => {
    card.match = false;
    card.shown = false;
    card.element.classList.add('unmatch');

    setTimeout(() => {
      card.element.classList.remove('open', 'show', 'unmatch');
    }, 500);
  });

  openCards = openCards.filter(card => !currentOpenCards.includes(card));
};

/* Checks if cards can be matched i.e. >= 2 open cards */
const canMatch = () => openCards.filter(card => card.shown).length >= 2;

/* Checks if all cards have been matched */
const isGameFinished = () =>
  openCards.length &&
  cards.length === openCards.length &&
  openCards.every(card => card.match);

/* Calculates how long player took to match all cards */
const calculateGameTime = () => {
  const endTime = new Date().getTime();
  const distance = endTime - startTime;
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  return `${seconds} seconds`;
};

/* Reveals a locked card when clicked */
const revealCard = (e, card) => {
  e.preventDefault();
  if (card.shown) return;
  if (openCards.includes(card)) return;

  openCard(card);
  if (canMatch()) matchCard();
  if (isGameFinished()) showScoreCard();
};

/* Starts a game timer */
const renderTimer = () =>
  setInterval(() => {
    const now = new Date().getTime();
    const distance = now - startTime;
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    timerNode.innerHTML = `${seconds}s`;
  }, 1000);

/* Appends a list of stars inside DOM */
const renderStars = () => {
  starsNode.innerHTML = null;
  stars.forEach(star => {
    const starElement = createElement('span', `fa fa-${star}`);
    starsNode.appendChild(starElement);
  });
};

/* Renders game board with stars and timer */
const renderGame = () => {
  deckNode.innerHTML = null;
  startTime = new Date().getTime();

  cardTypes.forEach((type, index) => {
    const element = createCard(type);
    const cardAttrs = {
      index,
      type,
      element,
      match: false,
      shown: false
    };

    element.addEventListener('click', e => revealCard(e, cardAttrs));
    cards.push(cardAttrs);
    deckNode.appendChild(element);
  });

  renderStars();
  renderTimer();
};

/* Initializes and renders game */
document.addEventListener('DOMContentLoaded', renderGame);
