/*
 * Create a list that holds all of your cards
*/

const deckNode = document.getElementById('deck')

function duplicateElements(array, times) {
  return array.reduce((res, current) => {
      return res.concat(Array(times).fill(current));
  }, []);
}

const cardTypes = duplicateElements([
  'diamond',
  'paper-plane-o',
  'anchor',
  'bolt',
  'cube',
  'leaf',
  'bicycle',
  'bomb'
], 2)

const createCard = (className) => {
  const cardElement = document.createElement('li')
  cardElement.className =  `card ${className}`
  const icon = document.createElement('i')
  icon.className = `fa fa-${className}`
  cardElement.appendChild(icon)
  return cardElement
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
}

const cards = []
// const randomCardTypes = shuffle(cardTypes)

cardTypes.forEach((type) => {
  cards.push({
    type,
    shown: false,
    locked: false,
    element: createCard(type)
  })
})

let openCards = []

cards.forEach(card => {
  deckNode.appendChild(card.element)
})

const openCard = (card) => {
  card.element.classList.add('open', 'show')
  card.shown = true
  openCards.push(card)
}

const canMatch = () => 
  openCards.filter(card => card.shown).length >= 2

const matchCard = () => {
  const currentOpenCards = openCards.filter(card => card.shown)
  const isMatch = currentOpenCards.every(card => {
    return currentOpenCards[0].type === card.type
  })

  if (isMatch) {
    currentOpenCards.forEach(card => {
      card.element.classList.add('match')
      card.shown = false
    })

    return 
  }

  lockCards(currentOpenCards)
}

const lockCards = (currentOpenCards) => {
  currentOpenCards.forEach(card => {
    card.locked = true
    card.shown = false
    card.element.classList.add('unmatch')
    setTimeout(() => {
      card.element.classList.remove('open', 'show', 'unmatch')
    }, 2000)
  })

  openCards = openCards.filter(card => !card.locked) 
}

const tryMatch = () => {
  if (canMatch()) matchCard()
}

const showCard = (e, card) => {
  e.preventDefault()
  if (card.shown) return 
  if (openCards.includes(card)) return

  openCard(card)
  
  setTimeout(tryMatch, 1000)
}

cards.forEach(card => card.element.addEventListener('click', (e) => showCard(e, card)))

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
