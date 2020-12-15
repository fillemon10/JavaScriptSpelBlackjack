//VARIABLES
var deck = [];
var players = [];
const gameBoard = document.querySelector(".game-board");
const startButton = document.querySelector(".start-button");
const hitButton = document.querySelector(".hit-button");
const standButton = document.querySelector(".stand-button");
const countDiv = document.createElement("div");
const playerCount = document.getElementById("players");
const gameBody = document.querySelector(".game-body");
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
  var suits = ["hearts", "diams", "clubs", "spades"];
  for (let i = 0; i < 4; i++) {
    for (let j = 2; j < 15; j++) {
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
    const handUl = document.createElement("ul");
    handUl.classList.add("table");
    handUl.classList.add("playingCards");
    for (let index = 0; index < player.Hand.length; index++) {
      const cardLi = document.createElement("li");
      cardInHand = document.createElement("div");
      if (first) {
        cardInHand.classList.add("back");
        first = false;
      } else {
        if (player.Hand[index].Number <= 10) {
          cardSpans(player.Hand[index].Number, player.Hand[index].Type);
          var rank = "rank-" + player.Hand[index].Number;
          cardInHand.classList.add(rank);
          cardInHand.classList.add(player.Hand[index].Type);
        } else {
          handUl.classList.add("faceImages");
          if (player.Hand[index].Number == 11) {
            cardInHand.classList.add("rank-j");
            cardInHand.classList.add(player.Hand[index].Type);
            cardSpans("J", player.Hand[index].Type);
          } else if (player.Hand[index].Number == 12) {
            cardInHand.classList.add("rank-q");
            cardInHand.classList.add(player.Hand[index].Type);
            cardSpans("Q", player.Hand[index].Type);
          } else if (player.Hand[index].Number == 13) {
            cardInHand.classList.add("rank-k");
            cardInHand.classList.add(player.Hand[index].Type);
            cardSpans("K", player.Hand[index].Type);
          } else if (player.Hand[index].Number == 14) {
            cardInHand.classList.add("rank-a");
            cardInHand.classList.add(player.Hand[index].Type);
            cardSpans("A", player.Hand[index].Type);
          }
        }
      }
      cardInHand.classList.add("card");
      cardLi.appendChild(cardInHand);
      handUl.appendChild(cardLi);
    }
    if (firstRound) {
      if (player.ID == 0) {
        playerDiv.appendChild(handUl);
        gameBoard.appendChild(playerDiv);
        return;
      } else {
        const countHand = document.createElement("p");
        countHand.classList.add("count");
        countHand.innerText = countCards(player.Hand);
        handUl.appendChild(countHand);
        if (countHand.innerText > 21) {
          bust(player);
        }
      }
    } else {
      const countHand = document.createElement("p");
      countHand.classList.add("count");
      countHand.innerText = countCards(player.Hand);
      handUl.appendChild(countHand);
      if (countHand.innerText > 21) {
        bust(player);
      }
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
      if (count > 21) {
        return count;
      }
    }
  }
  //returerar antalet
  return count;
}
function cardSpans(rank, suit) {
  const cardRank = document.createElement("span");
  const cardSuit = document.createElement("span");
  cardRank.classList.add("rank");
  cardRank.innerHTML = rank;
  cardInHand.appendChild(cardRank);
  cardSuit.classList.add("suit");
  cardSuit.innerHTML = "&" + suit + ";";
  cardInHand.appendChild(cardSuit);
}
function bust(player) {
  player.status = 0;
  stand();
}
function hit() {
  console.log(currentPlayer);
  players[currentPlayer].Hand.push(deck.pop());
  showHands();
  if (countCards(players[currentPlayer].Hand) == 21) {
    stand();
  }
  if (currentPlayer == 0 && countCards(players[currentPlayer].Hand) < 17) {
    hit();
  }
}
function stand() {
  if (currentPlayer == players.length - 1) {
    currentPlayer = 0;
    firstRound = false;
    dealersTurn();
  } else {
    currentPlayer++;
  }
}
function dealersTurn() {
  if (allPlayersBusted()) {
    checkWin();
  } else {
    dealersHand = countCards(players[currentPlayer].Hand);
    showHands();
    if (dealersHand >= 17 && dealersHand < 21) {
      console.log("i stand");
      stand();
    } else if (dealersHand < 17) {
      console.log("i hit");

      hit();
    } else if (dealersHand == 21) {
      console.log("i stand, 21");

      stand();
    }
    console.log("check win");
    checkWin();
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
function checkWin() {
  var arrayCount = [];
  players.forEach((player) => {
    arrayCount.push(countCards(player.Hand));
  });
  var first = true;
  var playerCounter = 0;
  arrayCount.forEach((playerCount) => {
    if (first) {
      first = false;
      return;
    }
    playerCounter++;
    if (playerCount == arrayCount[0]) {
      draw(playerCounter);
    } else if (playerCount < 21 && arrayCount[0] > 21) {
      playerWin(playerCounter, false);
    } else if (playerCount == 21 && playerCount[0] != 21) {
      playerWin(playerCounter, true);
    } else if (playerCount > arrayCount[0] && playerCount < 21) {
      playerWin(playerCounter, false);
    } else {
      dealersWins(playerCounter);
    }
  });
}
function dealersWins(player) {
  const winDiv = document.createElement("div");
  winDiv.classList.add("win");
  const winP = document.createElement("p");
  winP.innerText = "Dealer won against player " + player + "!";
  winDiv.appendChild(winP);
  gameBody.appendChild(winDiv);
}
function playerWin(player, is21) {
  const winDiv = document.createElement("div");
  winDiv.classList.add("win");
  const winP = document.createElement("p");
  winP.innerText = "Player " + player + " won!";
  winDiv.appendChild(winP);
  gameBody.appendChild(winDiv);
}
function draw(player) {
  const winDiv = document.createElement("div");
  winDiv.classList.add("win");
  const winP = document.createElement("p");
  winP.innerText = "Player " + player + " tied with dealer!";
  winDiv.appendChild(winP);
  gameBody.appendChild(winDiv);
}
