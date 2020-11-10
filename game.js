//deklarerar variabler
var deck = [];
var players = [];
const gameBoard = document.querySelector(".game-board");
const startButton = document.querySelector(".start-button");
const hitButton = document.querySelector(".hit-button");
const standButton = document.querySelector(".stand-button");
const countDiv = document.createElement("div");
var currentPlayer = 1;

//event listeners
startButton.addEventListener("click", startGame);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);

var count = 0;

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
    var player = { Name: "player " + index, ID: index, Hand: hand };

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
      const cardInHand = document.createElement("p");

      cardInHand.innerText =
        player.Hand[index].Type + " " + player.Hand[index].Number;
      cardInHand.classList.add("card");
      handDiv.appendChild(cardInHand);
    }

    const countHand = document.createElement("p");
    countHand.classList.add("count");

    countHand.innerText = countCards(player.Hand);
    handDiv.appendChild(countHand);
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
      count += 10;
    } //om det är ett ess
    else if (card.Number == 14) {
      count += 11;
    } //om det är längre än 10
    else {
      count += card.Number;
    } //om man över stiger 21
    if (count > 21) {
      //för varje kort i handen
      hand.forEach((card) => {
        //om det är ett ess
        if (card.Number == 14) {
          count -= 10;
        }
      });
    }
  }
  //returerar antalet
  return count;
}

function hit() {
  players[currentPlayer].Hand.push(deck.pop());
  showHands();
}
function stand() {
  if (currentPlayer == players.length) {
    currentPlayer = 0;
    dealersTurn();
  } else {
    currentPlayer++;
  }
}

function dealersTurn() {
  console.log(currentPlayer); 
}

//startar spelet
function startGame() {
  createDeck();
  shuffleDeck();
  createPlayers(2);
  drawHands();
  showHands();
  //debug kod
  var i = 0;
  deck.forEach((element) => {
    i++;
    console.log(i + " " + element.Number + " " + element.Type);
  });
  players.forEach((element) => {
    console.log(element.Hand);
  });
}
