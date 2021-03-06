//VARIABLES

//const variablarna är till för att selecta olika element och manipelera dem
const gameBoard = document.querySelector('.game-board');
const startButton = document.querySelector('.start-button');
const hitButton = document.querySelector('.hit-button');
const standButton = document.querySelector('.stand-button');
const countDiv = document.createElement('div');
const playerCount = document.getElementById('players');
const gameBody = document.querySelector('.game-body');
const restartButton = document.querySelector('.restart-button');
const consoleDiv = document.querySelector('.console');
const chooseLabel = document.querySelector('.choose-label');
var deck = [];
var players = [];
var currentPlayer = 1;
var count = 0;
var first = true;
var firstRound = true;
var finished = false;
var logTemp = '';
var alreadyExecuted = false;

//EVENT LISTENERS

//lyssnar efter tryck på knappar
startButton.addEventListener('click', startGame);
hitButton.addEventListener('click', hit);
standButton.addEventListener('click', stand);
restartButton.addEventListener('click', restart);

//FUNCTIONS
//startar spelet
function startGame() {
  //skriver i game log
  consoleLog('Starting game...');
  //pausar scripten en liten stund för att det inte ska gå så fort.
  setTimeout(function () {
    disableButtons();
    setTimeout(function () {
      createDeck();
      setTimeout(function () {
        shuffleDeck();
        var playerCountValue = playerCount.value;
        playerCountValue++;
        setTimeout(function () {
          createPlayers(playerCountValue);
          setTimeout(function () {
            drawHands();
            showHitNStand();
            showHands();
            setTimeout(function () {
              consoleLog('It is now player ' + currentPlayer + ' turn...', true);
            }, 500);
          }, 100);
        }, 500);
      }, 500);
    }, 100);
  }, 200);
}
//gömmer knappar
function disableButtons() {
  //gömmer start knappen osv.
  startButton.setAttribute('hidden', '');
  playerCount.setAttribute('hidden', '');
  chooseLabel.setAttribute('hidden', '');
}
//visar knappar
function showHitNStand() {
  //visar hit och stand knappen
  console.log("showing");

  hitButton.removeAttribute('hidden');
  standButton.removeAttribute('hidden');
}
//gömmer knappar
function hideHitNStand() {
  //gömmer hit and stand knappen
  console.log("hiding");
  hitButton.setAttribute('hidden', '');
  standButton.setAttribute('hidden', '');
}
//skapar en kortlek med 52 kort.
function createDeck() {
  //en kort lek har fyra valörer och 13 kort av varje valör (13*4=52)
  var suits = ['hearts', 'diams', 'clubs', 'spades'];

  //en multidimensional array måste skapas 
  //för varje suit/type
  for (let i = 0; i < 4; i++) {
    //för varje rank/number
    for (let j = 2; j < 15; j++) {
      //lägger till i decken
      deck.push({ Type: suits[i], Number: j });
    }
  }
}
//blandar kortleken
function shuffleDeck() {
  //blandar 500 gånger
  for (let index = 0; index < 500; index++) {
    //ger kort en ny position
    var location1 = Math.floor(Math.random() * deck.length);
    var location2 = Math.floor(Math.random() * deck.length);
    var temp = deck[location1];
    //byter plats
    deck[location1] = deck[location2];
    deck[location2] = temp;
  }
  consoleLog('Shuffling deck...');
}
//skapar spelare
function createPlayers(number) {
  //skapar "number" antal spelare
  for (let index = 0; index < number; index++) {
    var hand = [];
    //skapar spelarens egenskaper (kan göras med klass)
    var player = {
      Name: 'player ' + index,
      ID: index,
      Hand: hand,
      counted: 0,
      status: 1,
      money: 1000
    };
    //lägger till spelaren
    players[index] = player;
  }
}
//ger ut kort till varje spelares hand
function drawHands() {
  //för varje spelare
  players.forEach((player) => {
    for (let index = 0; index < 2; index++) {
      //ge 2 kort
      player.Hand[index] = deck.pop();
    }
  });
  consoleLog('Dealing cards to all players...');
}
//visar händerna i HTML
function showHands() {
  //resetar gameboard
  gameBoard.innerHTML = '';
  //först dealer
  var dealer = true;
  if (currentPlayer != 0) {
    first = true;
  }
  //för varje spelare
  players.forEach((player) => {
    //skapar div med korten
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player');
    playerDiv.classList.add('card');
    const playerID = document.createElement('label');
    playerID.classList.add('player-id');
    playerID.classList.add('player-' + player.ID);
    playerID.classList.add('card-header');
    if (currentPlayer == player.ID) {
      playerDiv.classList.add('bg-primary');
    }
    playerID.classList.add('card-body');
    //om det är dealern
    if (dealer) {
      playerID.innerText = 'Dealer: ';
      dealer = false;
    }
    //om det är spelaren
    else {
      playerID.innerText = 'Player ' + player.ID + ': ';
    }
    playerDiv.appendChild(playerID);
    const handUl = document.createElement('ul');
    handUl.classList.add('table');
    handUl.classList.add('playingCards');
    //skapar korten
    for (let index = 0; index < player.Hand.length; index++) {
      const cardLi = document.createElement('li');
      cardInHand = document.createElement('div');
      //dealers första kort
      if (first) {
        cardInHand.classList.add('back');
        first = false;
      } else {
        //alla kort 2-10
        if (player.Hand[index].Number <= 10) {
          cardSpans(player.Hand[index].Number, player.Hand[index].Type);
          var rank = 'rank-' + player.Hand[index].Number;
          cardInHand.classList.add(rank);
          cardInHand.classList.add(player.Hand[index].Type);
        } else {
          handUl.classList.add('faceImages');
          //knekt
          if (player.Hand[index].Number == 11) {
            cardInHand.classList.add('rank-j');
            cardInHand.classList.add(player.Hand[index].Type);
            cardSpans('J', player.Hand[index].Type);
            //dam
          } else if (player.Hand[index].Number == 12) {
            cardInHand.classList.add('rank-q');
            cardInHand.classList.add(player.Hand[index].Type);
            cardSpans('Q', player.Hand[index].Type);
            //kung
          } else if (player.Hand[index].Number == 13) {
            cardInHand.classList.add('rank-k');
            cardInHand.classList.add(player.Hand[index].Type);
            cardSpans('K', player.Hand[index].Type);
            //ess
          } else if (player.Hand[index].Number == 14) {
            cardInHand.classList.add('rank-a');
            cardInHand.classList.add(player.Hand[index].Type);
            cardSpans('A', player.Hand[index].Type);
          }
        }
      }
      cardInHand.classList.add('cards');
      cardLi.appendChild(cardInHand);
      handUl.appendChild(cardLi);
    }
    //om det är första rundan
    if (firstRound) {
      //räkna inte dealerns hand
      if (player.ID == 0) {
        playerDiv.appendChild(handUl);
        gameBoard.appendChild(playerDiv);
        return;
      } else {
        const countHand = document.createElement('label');
        countHand.classList.add('count');
        countHand.classList.add('badge');
        countHand.classList.add('bg-danger');
        countHand.classList.add('card-text');
        //räkna spelarens hand
        countHand.innerText = countCards(player.Hand);
        playerID.appendChild(countHand);
      }
      //om det inte är första rudan, visa allas händer
    } else {
      const countHand = document.createElement('label');
      countHand.classList.add('count');
      countHand.classList.add('card-text');
      countHand.classList.add('badge');
      countHand.classList.add('bg-danger');
      countHand.classList.add('card-text');
      countHand.innerText = countCards(player.Hand);
      playerID.appendChild(countHand);
    }
    playerDiv.appendChild(handUl);
    gameBoard.appendChild(playerDiv);
  });
}
//räknar korten i händerna
function countCards(hand) {
  //resetar räknaren
  count = 0;
  //för varje kort i handen
  for (let index = 0; index < hand.length; index++) {
    //definerar kort
    card = hand[index];
    //om det är ett klät kort
    if (card.Number >= 10 && card.Number < 14) {
      card.counted = 1;
      count += 10;
    } //om det är ett ess
    else if (card.Number == 14) {
      card.counted = 1;
      count += 11;
    } //om det är längre än 10
    else {
      card.counted = 1;
      count += card.Number;
    } //om man över stiger 21
    if (count > 21) {
      //för varje kort i handen
      hand.forEach((card) => {
        //om det är ett ess
        if (card.Number == 14 && card.counted == 1) {
          card.counted = 2;
          count -= 10;
        }
      });
    }
  }
  //returerar antalet
  return count;
}
//skapar kortens span element
function cardSpans(rank, suit) {
  const cardRank = document.createElement('span');
  const cardSuit = document.createElement('span');
  cardRank.classList.add('rank');
  cardRank.innerHTML = rank;
  cardInHand.appendChild(cardRank);
  cardSuit.classList.add('suit');
  cardSuit.innerHTML = '&' + suit + ';';
  cardInHand.appendChild(cardSuit);
}
//om spelaren går över 21
function bust(player) {
  //kollar om spelet inte är färdigt
  if (!finished) {
    if (countCards(players[currentPlayer].Hand) > 21) {
      hideHitNStand();
      setTimeout(function () {
        //änder spelaren status till 0(busted)
        player.status = 0;
        //om det är dealern
        if (currentPlayer == 0) {
          consoleLog('The dealer busted...');
          checkWin();
          return;
        } else {
          //om det är en spelare
          consoleLog('Player ' + currentPlayer + ' busted...');
        }
        stand();
      }, 500);
    }
  }
}
//om man trycker på hit, ge ett kort
function hit() {
  //kollar om spelet inte är färdigt
  if (!finished) {
    //om det är dealern
    hideHitNStand();
    if (currentPlayer == 0) {
      consoleLog('The dealer hit...');
    } else {
      //om det är spelaren
      consoleLog('Player ' + currentPlayer + ' hit...');
    }
    //ge är kort till spelaren
    players[currentPlayer].Hand.push(deck.pop());
    showHands();
    // om dealern ska hit igen
    if (currentPlayer == 0 && countCards(players[currentPlayer].Hand) < 17 && !allPlayersBusted()) {
      hit();

    } else if (currentPlayer == 0 && countCards(players[currentPlayer].Hand) >= 17 && !allPlayersBusted()) {
      checkWin();
    }
    //kolla om spelaren har busted, över 21
    if (countCards(players[currentPlayer].Hand) > 21) {
      bust(players[currentPlayer]);
      //om det är dealern
    }
    if (currentPlayer != 0) {
      setTimeout(() => {
        showHitNStand();
      }, 500);
    }
  }
}
//om spelaren trycker på stand, stå kvar
function stand() {
  //kollar om spelet inte är färdigt
  if (!finished) {
    hideHitNStand();
    setTimeout(function () {
      //om det är dealern och dealern inte är busted
      if (currentPlayer == 0 && players[currentPlayer].status != 0) {

        consoleLog('The dealer stand...');
      }
      //om spelaren inte är busted
      else if (players[currentPlayer].status != 0) {

        consoleLog('Player ' + currentPlayer + ' stands...');
      } else {
        if (allPlayersBusted()) {
          checkWin();
        }
      }
      //om det är dealerns tur
      if (currentPlayer == players.length - 1) {
        setTimeout(() => {
          currentPlayer = 0;
          firstRound = false;
          if (!allPlayersBusted()) {

            consoleLog('It is now the dealers turn...', true);
            dealersTurn();
          }
        }, 1000);
      } else if (currentPlayer > 0) {
        setTimeout(() => {

          //nästa spelares tur
          currentPlayer++;
          consoleLog('It is now player ' + currentPlayer + ' turn...', true);
          showHands();
        }, 1000);
      }
      showHands();
    }, 500);
    if (currentPlayer == 0 || currentPlayer == players.length - 1) {  
    } else {
      setTimeout(() => {
        showHitNStand();
      }, 500);
    }
  }
}
function dealersTurn() {
  //kollar om spelet inte är färdigt
  if (!finished) {
    hideHitNStand();
    if (allPlayersBusted()) {
    } else {
      //räkna handen
      dealersHand = countCards(players[currentPlayer].Hand);
      showHands();
      //om dealern är mellan 17-21
      if (dealersHand >= 17 && dealersHand < 21) {
        setTimeout(() => {
          stand();
          checkWin();
        }, 1000);
      }
      //om dealern är under 17
      else if (dealersHand < 17) {
        setTimeout(function () {
          hit();
        }, 1000);
      }
      //om dealern fick 21
      else if (dealersHand == 21) {
        stand();
        checkWin();
      } else {
        bust(0);
      }
    }
  }
}
//kolla om alla spelare busted
function allPlayersBusted() {
  var bustedList = [];
  //för varje spelare
  players.forEach((player) => {
    //om dom har bustat
    if (player.status == 0) {
      //lägg till i busted listan
      bustedList.push(player);
    }
  });
  //om busted listan är lika stor som antalet spelare
  if (bustedList.length == players.length - 1) {
    bustedList = [];
    return true;
  } else {
    bustedList = [];
    return false;
  }
}
//kolla vilka som vinner
function checkWin() {
  if (!alreadyExecuted) {
    hideHitNStand();
    alreadyExecuted = true;
    var countList = [];
    //för varje spelare
    players.forEach((player) => {
      //lägg till i listan spelarens poäng
      countList.push(countCards(player.Hand));
    });
    var first = true;
    var playerCounter = 0;
    countList.forEach((playerCount) => {
      setTimeout(function () {

        //skippa dealern
        if (first) {
          first = false;
          return;
        }
        playerCounter++;
        //om spelaren är under 21 och dealern busted
        if (playerCount < 21 && countList[0] > 21) {
          playerWin(playerCounter, false);

        }
        //om spelaren fick 21 och dealern inte fick 21
        else if (playerCount == 21 && playerCount[0] != 21) {

          playerWin(playerCounter, true);

        }
        //om spelaren fick högre än dealern och är under 21
        else if (playerCount > countList[0] && playerCount < 21) {


          playerWin(playerCounter, false);


        }
        //om spelaren och dealern har samma poäng
        else if (playerCount == countList[0]) {


          draw(playerCounter);
        }
        //annars vinner dealern
        else {

          dealersWins(playerCounter);
        }
      }, 300);
    });
  }
}
//om dealern vann
function dealersWins(player) {
  if (player != 0) {
    setTimeout(function () {

      consoleLog('Dealer won against player ' + player + '!', true);
    }, 500);
  }
  hideShowButtons();
}
//om spelaren vann
function playerWin(player) {
  setTimeout(function () {

    consoleLog('Player ' + player + ' won against the dealer!', true);
  }, 500);
  hideShowButtons();

}
//om det blev lika
function draw(player) {
  setTimeout(function () {

    consoleLog('Player ' + player + ' tied with dealer!', true);
  }, 500);
  hideShowButtons();

}
//gömmer och visar knappar
function hideShowButtons() {
  restartButton.removeAttribute('hidden');
  hitButton.setAttribute('hidden', '');
  standButton.setAttribute('hidden', '');
  finished = true;
}
//om man trycker restart knappen
function restart() {
  //reloada spelet
  window.location.reload(false);
}
//gör ett konsol inlägg
function consoleLog(log, bold) {

  //om loggen inte är samma som förra eller om loggen är hit
  if (logTemp != log || log == 'Player ' + currentPlayer + ' hit...' || log == 'The dealer hit...') {
    //skapar elementet
    const logLi = document.createElement('li');
    //loggar i HTML
    logLi.innerHTML = log;
    //om bold är true
    if (bold) {
      //gör texten bold
      logLi.classList.add('fw-bold');
    }
    consoleDiv.appendChild(logLi);
    //sparar loggen
    logTemp = log;

    //skapar nytt ljud
    tone = new sound("tone.mp3");

    //spelar ljudet tone
    tone.play();
  }
}
//ljud funktion
function sound(src) {
  //skapar sound
  this.sound = document.createElement("audio");

  //src är tone.mp3
  this.sound.src = src;

  //preloadar och tar bort kontrollerna
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");

  //gör så den inte syns
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);

  //spelar ljudet
  this.play = function () {
    this.sound.play();
  }
}
