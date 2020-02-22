// Patrón módulo
const myModule = (() => {
  'use strict'

  let deck        = [];
  const types     = ['C', 'D', 'H', 'S'],
        faceCards = ['A', 'J', 'Q', 'K'];

  let playersScores = [];

  // Refenrecias del HTML
  const btnNew  = document.querySelector('#btnNew'),
        btnPick = document.querySelector('#btnPick'),
        btnStop = document.querySelector('#btnStop')

  const scoreHMTL    = document.querySelectorAll('small'),
        playersCards = document.querySelectorAll('.cards');

  // Esta función inicializa el juego
  const initGame = (numPlayers = 2) => {
    deck = createDeck();
    playersScores = new Array(numPlayers).fill(0, 0, numPlayers);

    scoreHMTL.forEach(elem => elem.innerText = 0);
    playersCards.forEach(elem => elem.innerHTML = '');

    btnPick.disabled = false;
    btnStop.disabled = false;
  }

  // Esta función crea una nueva baraja
  const createDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (const type of types) {
        deck.push(`${i}${type}`);
      }
    }
    for (const type of types) {
      for (const faceCard of faceCards) {
        deck.push(`${faceCard}${type}`);
      }
    }
    return _.shuffle(deck);
  }

  /**
   * Esta función me permite tomar una carta
   * No es necesario comprobar que haya cartas ya que es matemáticamente
   * imposible que la baraja se desborde con 2 jugadores
   */

  const pickCard = () => deck.pop();

  const cardValue = (card) => {
    const value = card.substring(0, card.length - 1);
    return (isNaN(value)) ?
      ((value === 'A') ? 11 : 10)
      : parseInt(value);
  }

  // Turn: 0 = primer jugador y el último será la computadora
  const collectPointsPlayer = (card, turn) => {
    playersScores[turn] += cardValue(card);
    scoreHMTL[turn].innerText = playersScores[turn];
    return playersScores[turn];
  }

  const createCard = (card, turn) => {
    const imgCard = document.createElement('img');
    imgCard.src = `./assets/cartas/${card}.png`;
    imgCard.classList = 'carta';
    playersCards[turn].append(imgCard);
  }

  const determinateWinnner = (posPlayer, posComputer) => {
    const message = ((playersScores[posPlayer] >= playersScores[posComputer] || playersScores[posComputer] > 21) && (playersScores[posPlayer] <= 21)) ?
      (playersScores[posPlayer] === playersScores[posComputer]) ?
        'Empate!!! Nadie gana!' : 'Ganaste!!!' :
      'Perdiste!!!';

    setTimeout(() => {
      alert(message);
    }, 100);
  };

  // Turno de la computadora
  const computerTurn = (minimumScore) => {
    // Chequeamos que el valor mínimo necesario según las reglas del blackjack
    minimumScore = (minimumScore > 21) ? 0 :
      (minimumScore === 21) ? 21 :
        17;

    const posPlayer = 0,
          posComputer = playersScores.length - 1;
    do {
      const card = pickCard();
      playersScores[posComputer] = collectPointsPlayer(card, posComputer);
      createCard(card, posComputer)
    } while (playersScores[posComputer] < minimumScore);
    determinateWinnner(posPlayer, posComputer);
  }

  const changeTurn = (turn, message = false) => {
    if (message) console.warn(message);
    btnPick.disabled = true;
    btnStop.disabled = true;
    computerTurn(turn);
  }

  // Eventos
  btnPick.addEventListener('click', () => {
    const card = pickCard();
    const playerScore = collectPointsPlayer(card, 0);

    createCard(card, 0);

    if (playerScore > 21) {
      changeTurn(playersScores[0], 'Perdiste!!!');
    } else if (playerScore === 21) {
      changeTurn(playersScores[0], '21, genial!!!');
    }

  });

  btnStop.addEventListener('click', () => changeTurn(playersScores[0]) );

  btnNew.addEventListener('click', () => initGame() );

  return {
    newGame: initGame
  };

})();

