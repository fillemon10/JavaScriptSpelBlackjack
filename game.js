//VARIABLES
var deck = [];
var players = [];
const gameBoard = document.querySelector(".game-board");
const startButton = document.querySelector(".start-button");
const hitButton = document.querySelector(".hit-button");
const standButton = document.querySelector(".stand-button");
const countDiv = document.createElement("div");
const playerCount = document.getElementById("players");
var currentPlayer = 1;
var count = 0;
var first = true;
var firstRound = true;

//EVENT LISTENERS
startButton.addEventListener("click", startGame);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);

//FUNCTIONS
//startar spelet
function startGame() {
  disableButtons();
  createDeck();
  shuffleDeck();
  var playerCountValue = playerCount.value;
  playerCountValue++;
  createPlayers(playerCountValue);
  drawHands();
  showHands();
}
//gör visa knappar otryckbara
function disableButtons() {
  startButton.setAttribute("disabled", "disabled");
  playerCount.setAttribute("disabled", "disabled");
}
//skapar en kortlek med 52 kort. Kan nog optimeras
function createDeck() {
  for (let index = 0; index < 52; index++) {
    if (index <= 12) {
      var card = { Type: "♥", Number: index + 2 };
      deck[index] = card;
    } else if (index <= 25 && index > 12) {
      var card = { Type: "♦", Number: index - 11 };
      deck[index] = card;
    } else if (index <= 38 && index > 25) {
      var card = { Type: "♣", Number: index - 24 };
      deck[index] = card;
    } else if (index <= 51 && index > 38) {
      var card = { Type: "♠", Number: index - 37 };
      deck[index] = card;
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
}
//skapar spelare
function createPlayers(number) {
  //skapar "number" antal spelare
  for (let index = 0; index < number; index++) {
    var hand = [];
    //skapar spelarens egenskaper
    var player = {
      Name: "player " + index,
      ID: index,
      Hand: hand,
      counted: 0,
      status: 1,
    };
    //lägger till spelaren
    players[index] = player;
  }
}
//ger ut kort till varje spelares hand
function drawHands() {
  players.forEach((player) => {
    for (let index = 0; index < 2; index++) {
      player.Hand[index] = deck.pop();
    }
  });
}
//visar händerna i HTML
function showHands() {
  gameBoard.innerHTML = "";
  var dealer = true;
  if (currentPlayer != 0) {
    first = true;
  }
  players.forEach((player) => {
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player");
    const playerID = document.createElement("p");
    playerID.classList.add("player-id");
    if (dealer) {
      playerID.innerText = "Dealer:";
      dealer = false;
    } else {
      playerID.innerText = "Player " + player.ID + ":";
    }
    playerDiv.appendChild(playerID);
    const handDiv = document.createElement("div");
    handDiv.classList.add("hand");
    for (let index = 0; index < player.Hand.length; index++) {
      cardInHand = document.createElement("p");
      if (first) {
        first = false;
      } else {
        if (player.Hand[index].Number <= 10)
          cardInHand.innerText =
            player.Hand[index].Number + player.Hand[index].Type;
        else {
          if (player.Hand[index].Number == 11) {
            cardInHand.innerText = "J" + player.Hand[index].Type;
          } else if (player.Hand[index].Number == 12) {
            cardInHand.innerText = "Q" + player.Hand[index].Type;
          } else if (player.Hand[index].Number == 13) {
            cardInHand.innerText = "K" + player.Hand[index].Type;
          } else if (player.Hand[index].Number == 14) {
            cardInHand.innerText = "A" + player.Hand[index].Type;
          }
        }
        cardInHand.classList.add("card");
      }
      handDiv.appendChild(cardInHand);
    }
    if (firstRound) {
      if (player.ID == 0) {
        playerDiv.appendChild(handDiv);
        gameBoard.appendChild(playerDiv);
        return;
      } else {
        const countHand = document.createElement("p");
        countHand.classList.add("count");
        countHand.innerText = countCards(player.Hand);
        handDiv.appendChild(countHand);
        if (countHand.innerText > 21) {
          bust(player);
        }
      }
    } else {
      const countHand = document.createElement("p");
      countHand.classList.add("count");
      countHand.innerText = countCards(player.Hand);
      handDiv.appendChild(countHand);
      if (countHand.innerText > 21) {
        bust(player);
      }
    }
    playerDiv.appendChild(handDiv);
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
      if (count > 21) {
        return count;
      }
    }
  }
  //returerar antalet
  return count;
}
function bust(player) {
  player.status = 0;
  stand();
}
function hit() {
  players[currentPlayer].Hand.push(deck.pop());
  showHands();
}
function stand() {
  if (currentPlayer == players.length - 1) {
    console.log("dealersTurn");
    currentPlayer = 0;
    firstRound = false;
    dealersTurn();
  } else {
    currentPlayer++;
  }
}
function dealersTurn() {
  if (allPlayersBusted()) {
    dealersWins();
  } else {
    dealersHand = countCards(players[currentPlayer].Hand);
    showHands();
    if (dealersHand >= 17 && dealersHand < 21) {
      stand();
    } else if (dealersHand < 17) {
      hit();
    } else if (dealersHand == 21) {
      dealersWins();
    }
  }
}
function allPlayersBusted() {
  var bustedList = [];
  players.forEach((player) => {
    if (player.status == 0) {
      bustedList.push(player);
    }
  });
  if (bustedList.length == players.length - 1) {
    bustedList = [];
    return true;
  } else {
    bustedList = [];
    return false;
  }
}
function dealersWins() {}
