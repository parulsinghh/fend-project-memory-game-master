# Memory Game Project

The game board consists of sixteen "cards" arranged in a grid. The deck is made up of eight different pairs of cards, each with different symbols on one side. The cards are arranged randomly on the grid with the symbol face down. The gameplay rules are very simple: flip over two hidden cards at a time to locate the ones that match!

[https://angry-noyce-233e62.netlify.com/](https://angry-noyce-233e62.netlify.com/)

![img](./img/app.png)

## Code Structure

- css
- img
- js
- index.html

## Dependencies

- [sweetalert](https://sweetalert.js.org/guides/)
- [font-awesome](https://fontawesome.com/)
- Google fonts Coda

## Running locally

Please open up [index.html](index.html) in your browser to run the app

## How to play

Total allowed moves: 36 (3\*)

Each turn:

- Click a card to reveal
- Click another card to reveal and match with card revealed in step 1
- If the cards match, both cards stay open and locked
- If the cards do not match, both cards are returned to their hidden state
- The game ends once all cards have been correctly matched.

**Note** A player has 36 moves to match all cards correctly
