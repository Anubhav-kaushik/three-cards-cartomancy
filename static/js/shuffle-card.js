const cardContainerClass = '.cards-container';
const cardClass = '.card';

function createCard(cardId) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.cardNum = cardId;
    card.dataset.choosen = false;
    return card;
}

function addCard2Board(card) {
    const container = document.querySelector(cardContainerClass);
    container.append(card);
}

function createCards(howMany) {
    /*
        This function create given numbers of cards and add them to the Card Container.
        howMany: How many cards you want to add
    */

    for (let i = 0; i < howMany; i++) {
        let card = createCard(i + 1)
        addCard2Board(card);
    }
}

function interval(a, b) {
    temp = [];
    for (let i = a; i <= b; i++) {
        temp.push(i);
    }
    return temp;
}

function shuffle(nums) {
    let shuffledNums = []
    let usedIndexes = []
    for (let i = 0; i < nums.length; i++) {
        let randomIndex = Math.floor(Math.random() * nums.length);
        while (usedIndexes.includes(randomIndex)) {
            randomIndex = Math.floor(Math.random() * nums.length);
        }
        shuffledNums.push(nums[randomIndex]);
        usedIndexes.push(randomIndex);
    }
    return shuffledNums;
}

function shuffleCardsNum() {
    /*
        This function shuffle the cards number.
    */

    const cards = document.querySelectorAll(cardClass);
    const cardsNum = interval(1, cards.length);
    const shuffledCardsNum = shuffle(cardsNum);

    for (let i = 0; i < cards.length; i++) {
        cards[i].dataset.cardNum = shuffledCardsNum[i];
    }
}

function moveUp(cardDataId, howMuch) {
    /*
        This function move the card with given data-id up by given howMuch.
        cardDataId: The data-id of the card you want to move up.
        howMuch: How much you want to move up.
    */
    const cardsContainer = document.querySelector(cardContainerClass);
    const card = document.querySelector(`[data-card-num="${cardDataId}"]`);
    const cardsContainerHeight = cardsContainer.offsetHeight;
    const cardHeight = card.offsetHeight;
    const centerY = cardsContainerHeight / 2;

    card.style.top = `${centerY - cardHeight/2 - howMuch}px`;
    card.dataset.choosen = true;
}

function numCardsChoosed() {
    const cards = document.querySelectorAll(cardClass);
    let num = 0;
    for (let card of cards) {
        if (card.dataset.choosen == 'true') {
            num += 1;
        }
    }
    return num;
}

async function spreadCards() {
    /*
        This function spread the deck of card on to the board
    */
    const cardsContainer = document.querySelector(cardContainerClass);
    const cards = document.querySelectorAll(cardClass);
    const cardContainerWidth = cardsContainer.offsetWidth;
    const cardWidth = cards[0].offsetWidth;
    const width = cardContainerWidth - cardWidth;
    const increament = width / (cards.length - 1) > 15 ? width / (cards.length - 1) : 15;
    
    
    let initialPos = 0;
    for (let card of cards) {
        const posTop = Math.floor(initialPos/width);
        card.style.left = `${initialPos}px`;
        
        initialPos += increament;

        if (initialPos >= width) {
            initialPos = width;
        }
    }
}

async function move2center(oneByone = false, delay = 0.15, splitHalf = false, reverse = false, moveBothEnds =
    false, moveNcards = 1) {
    /*
        Move cards to the center of the board.
        Parameters:
            oneByone: move the card to the center in one by one fashion
            delay: this provides the time between two adjacent card movement, use when oneByone is set to true
            splitHalf: Only move the half deck to the center
            reverse: Move the card in reverse order
            moveBothEnds: Move cards from both the ends towards the center. Note: Reverse will not work if it is true.
    */

    const cardsContainer = document.querySelector(cardContainerClass);
    const centerX = cardsContainer.offsetWidth / 2;
    const cards = document.querySelectorAll(cardClass);

    let maxRange = moveBothEnds ? Math.ceil(cards.length / 2) : cards.length;

    let count = 0;
    let zIndex = 0;
    for (let i = 0; i < maxRange; i++) {
        let j = i;
        while (j < (count+1)*moveNcards) {
            let card = reverse && !moveBothEnds ? cards[cards.length - j - 1] : cards[j];
            card.style.left = `${centerX - card.offsetWidth/2}px`;
            card.style.zIndex = zIndex++;

            if (moveBothEnds) {
                cards[cards.length - j - 1].style.left = `${centerX - cards[cards.length-j-1].offsetWidth/2}px`;
                cards[cards.length - j - 1].style.zIndex = zIndex++;
            }
            console.log(`inside while loop: ${j}`);
            j++;
        }
        i = j-1;

        if (oneByone) {
            await sleep(delay);
        }
        
        count++;
        if (splitHalf && count >= cards.length / 2) {
            break;
        }
    }
}

async function move2leftMost(oneByone = false, delay = 0.15, splitHalf = false, reverse = false) {
    /*
        Move cards to the left most of the board.
        Parameters:
            oneByone: move the card to the left most in one by one fashion
            delay: this provides the time between two adjacent card movement, use when oneByone is set to true
            splitHalf: Only move the half deck to the left most
            reverse: Move the card in reverse order
    */
    const cards = document.querySelectorAll(cardClass);

    let count = 0;
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        if (reverse) {
            card = cards[cards.length - i - 1];
        }

        count++;
        card.style.left = `${0}px`;
        if (oneByone) {
            await sleep(delay);
        }

        if (splitHalf && count >= cards.length / 2) {
            break;
        }
    }
}

async function move2left(howMuch, oneByone = false, delay = 0.15, splitHalf = false, reverse = false) {
    /*
        Move cards to the left of the board.
        Parameters:
            howMuch: How much you want to move the card to the left from the center. This should be a string with amount and unit (example: '20%' or '20px' or '20rem').
            oneByone: move the card to the left in one by one fashion
            delay: this provides the time between two adjacent card movement, use when oneByone is set to true
            splitHalf: Only move the half deck to the left
            reverse: Move the card in reverse order
    */
    const cardsContainer = document.querySelector(cardContainerClass);
    const centerX = cardsContainer.offsetWidth / 2;

    const cards = document.querySelectorAll(cardClass);

    let count = 0;
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        if (reverse) {
            card = cards[cards.length - i - 1];
        }

        count++;
        card.style.left = `calc(${centerX - card.offsetWidth/2}px - ${howMuch})`;

        if (oneByone) {
            await sleep(delay);
        }

        if (splitHalf && count >= cards.length / 2) {
            break;
        }
    }
}

async function move2rightMost(oneByone = false, delay = 0.15, splitHalf = false, reverse = false) {
    /*
        Move cards to the right most of the board.
        Parameters:
            oneByone: move the card to the right most in one by one fashion
            delay: this provides the time between two adjacent card movement, use when oneByone is set to true
            splitHalf: Only move the half deck to the right most
            reverse: Move the card in reverse order
    */
    const cardsContainer = document.querySelector(cardContainerClass);
    const cards = document.querySelectorAll(cardClass);

    let count = 0;
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        if (reverse) {
            card = cards[cards.length - i - 1];
        }

        count++;
        card.style.left = `${cardsContainer.offsetWidth - card.offsetWidth}px`;
        if (oneByone) {
            await sleep(delay);
        }

        if (splitHalf && count >= cards.length / 2) {
            break;
        }
    }
}

async function move2right(howMuch, oneByone = false, delay = 0.15, splitHalf = false, reverse = false) {
    /*
        Move cards to the right of the board.
        Parameters:
            howMuch: How much you want to move the card to the right from the center. This should be a string with amount and unit (example: '20%' or '20px' or '20rem').
            oneByone: move the card to the right in one by one fashion
            delay: this provides the time between two adjacent card movement, use when oneByone is set to true
            splitHalf: Only move the half deck to the right
            reverse: Move the card in reverse order
    */
    const cardsContainer = document.querySelector(cardContainerClass);
    const centerX = cardsContainer.offsetWidth / 2;

    const cards = document.querySelectorAll(cardClass);

    let count = 0;
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        if (reverse) {
            card = cards[cards.length - i - 1];
        }

        count++;

        card.style.left = `calc(${centerX - card.offsetWidth/2}px + ${howMuch})`;
        if (oneByone) {
            await sleep(delay);
        }

        if (splitHalf && count >= cards.length / 2) {
            break;
        }
    }
}

function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function resetPosition() {
    const cards = document.querySelectorAll(cardClass);

    for (let card of cards) {
        const dataId = card.dataset.cardNum;
        const isChoosen = card.dataset.choosen;

        if (isChoosen == "true") {
            moveUp(dataId, 0);
            card.dataset.choosen = "false";
        }
    }
}

async function shuffleCards() {
    /*
        Shuffle the cards in the deck.
    */
    shuffleCardsNum();
    resetPosition();

    move2left('20%', oneByone = false, delay = 0.15, splitHalf = true, reverse = false);
    move2right('20%', oneByone = false, delay = 0.15, splitHalf = true, reverse = true);
    await sleep(0.5);
    await move2center(oneByone = true, delay = 0.15, splitHalf = false, reverse = false, moveBothEnds =
        true, moveNcards=3);
    resetZIndex(); // this line removes symmetry around the center
    await sleep(0.5);
    spreadCards();
}

function resetZIndex() {
    const cards = document.querySelectorAll(cardClass);
    for (let card of cards) {
        card.style.zIndex = "0";
    }
}

function createParabola(card, totalCards, upwardOpen = true, maxHeight = 400) {
    const zIndex = card.style.zIndex;
    const cardsOn1Side = Math.ceil(totalCards / 2);
    const cardSide = zIndex%2 ? -1 : 1;
    const cardXposition = cardSide*(cardsOn1Side - Math.floor(zIndex/2));

    const direction = upwardOpen ? -1 : 1;
    const factor = (maxHeight - card.offsetHeight);
    const cardYposition = (factor/(cardsOn1Side*cardsOn1Side))*direction*(cardXposition * cardXposition - cardsOn1Side * cardsOn1Side);

    card.style.transform = `translateY(${cardYposition}px)`;
}

// add cards to the board and spread over the board
let indicator = false
async function setupCards() {
    createCards(52);
    move2leftMost();
    await sleep(1);
    spreadCards();
    indicator = true;
}
setupCards();

const cardsContainer = document.querySelector(cardContainerClass);
const cards = document.querySelectorAll(cardClass);

// this observer helps in spreading the deck on the board based on board size
const observer = new ResizeObserver(entries => {
    entries.forEach(entry => {
        const {
            width,
            height
        } = entry.contentRect;
        if (indicator) {
            spreadCards();
        }
    });
});

observer.observe(cardsContainer);

// this observer helps in moving the card up on click
for (let card of cards) {
    card.addEventListener('click', (entry) => {
        const cardId = entry.target.dataset.cardNum;
        const isChoosen = entry.target.dataset.choosen

        if (numCardsChoosed() < 1 && isChoosen == "false") {
            moveUp(cardId, 80);
        } else if (isChoosen == "true") {
            moveUp(cardId, 0);
            entry.target.dataset.choosen = false;
        } else {
            console.log('You can only choose 1 cards')
        }
    });
}

