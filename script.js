// Game data
const neurotoxicants = [
  { name: "Lead", category: "Heavy Metals", image: "metals.jpeg", partner: "" },
  {
    name: "Mercury",
    category: "Heavy Metals",
    image: "metals.jpeg",
    partner: "",
  },
  {
    name: "Manganese",
    category: "Heavy Metals",
    image: "metals.jpeg",
    partner: "",
  },
  {
    name: "Polychlorinated Biphenyl Compounds",
    category: "Industrial Chemicals",
    image: "industry.jpeg",
    partner: "",
  },
  {
    name: "Organophosphate Pesticides",
    category: "Industrial Chemicals",
    image: "industry.jpeg",
    partner: "",
  },
  {
    name: "Phthalates",
    category: "Endocrine Disruptors",
    image: "plastic.jpeg",
    partner: "",
  },
  {
    name: "Bisphenol A",
    category: "Endocrine Disruptors",
    image: "plastic.jpeg",
    partner: "",
  },
  {
    name: "Polybrominated Diphenyl Ethers",
    category: "Endocrine Disruptors",
    image: "plastic.jpeg",
    partner: "",
  },
];

const sources = [
  {
    name: "Paint in older homes, contaminated drinking water",
    image: "",
    category: "Heavy Metals",
    partner: "Lead",
  },
  {
    name: "Contaminated fish and shellfish",
    image: "",
    category: "Heavy Metals",
    partner: "Mercury",
  },
  {
    name: "Contaminated drinking water",
    image: "",
    category: "Heavy Metals",
    partner: "Manganese",
  },
  {
    name: "Contaminated food, environments with old electrical equipment",
    image: "",
    category: "Industrial Chemicals",
    partner: "Polychlorinated Biphenyl Compounds",
  },
  {
    name: "Residues on fruits and vegetables, living near agriculture",
    image: "",
    category: "Industrial Chemicals",
    partner: "Organophosphate Pesticides",
  },
  {
    name: "Household dust, plastic toys, food packaging, personal care products",
    image: "",
    category: "Endocrine Disruptors",
    partner: "Phthalates",
  },
  {
    name: "Plastic containers, lining inside canned food and baby formulas",
    image: "",
    category: "Endocrine Disruptors",
    partner: "Bisphenol A",
  },
  {
    name: "Household dust, furniture/electronics upholstered with flame retardants",
    image: "",
    category: "Endocrine Disruptors",
    partner: "Polybrominated Diphenyl Ethers",
  },
];

// Prepare cards
const cards = [...neurotoxicants, ...sources].map((item, index) => {
  return {
    id: index,
    name: item.name,
    category: item.category,
    image: item.image,
    partner: item.partner,
  };
});

// Shuffle cards
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const cardGrid = document.querySelector(".card-grid");
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

function createCardElements() {
  console.log("Creating card elements");
  const neurotoxicantsRow = document.querySelector("#neurotoxicants-row");
  const sourcesRow = document.querySelector("#sources-row");

  // check if the rows already have cards
  if (neurotoxicantsRow.hasChildNodes() || sourcesRow.hasChildNodes()) {
    return;
  }

  const shuffledCards = shuffle(cards);

  shuffledCards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = card.id;
    cardElement.dataset.name = card.name;
    cardElement.dataset.category = card.category;
    cardElement.dataset.partner = card.partner;

    // Create the image element if it exists
    if (card.image) {
      const imgElement = document.createElement("img");
      imgElement.src = card.image;
      imgElement.alt = "";
      imgElement.classList.add("card-image");
      cardElement.appendChild(imgElement);
    }

    // Create a span for the card name
    const nameElement = document.createElement("span");
    nameElement.classList.add("card-name");
    nameElement.textContent = card.name;

    if (card.image === "") {
      nameElement.style.backgroundColor = "transparent";
      nameElement.style.color = "black";
    }
    cardElement.appendChild(nameElement);

    cardElement.addEventListener("click", flipCard);

    // Append card to the respective row based on category
    if (card.image !== "") {
      neurotoxicantsRow.appendChild(cardElement); // All neurotoxicants
    } else {
      sourcesRow.appendChild(cardElement); // All sources
    }
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  const overlayElement = document.createElement("div");
  overlayElement.classList.add("card-overlay");

  // Append overlay to the current card
  this.appendChild(overlayElement);

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    lockBoard = true;

    checkForMatch();
  }
}

function checkForMatch() {
  console.log("Checking for match");
  const isMatch =
    firstCard.dataset.name === secondCard.dataset.partner ||
    firstCard.dataset.partner === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  matchedPairs++;
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  const firstCardOverlay = firstCard.querySelector(".card-overlay");
  const secondCardOverlay = secondCard.querySelector(".card-overlay");

  setTimeout(() => {
    if (firstCardOverlay) {
      firstCardOverlay.style.background = "rgba(0, 128, 0, 0.4)"; // Green semi-transparent overlay
    }
    if (secondCardOverlay) {
      secondCardOverlay.style.background = "rgba(0, 128, 0, 0.4)"; // Green semi-transparent overlay
    }
  }, 500);

  resetBoard();

  if (matchedPairs === cards.length / 2) {
    showCompletionMessage();
  }
}

// Unflip cards if not a match
function unflipCards() {
  setTimeout(() => {
    firstCard.removeChild(firstCard.lastChild);
    secondCard.removeChild(secondCard.lastChild);
    resetBoard();
  }, 500);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// TODO test this
function showCompletionMessage() {
  const messageElement = document.querySelector(".message");
  messageElement.innerHTML = "Congratulations! You matched all pairs!";
}

// Initialize game
createCardElements();
