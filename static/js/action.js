// jsondata --> cardsInfo

const mainContainerSelector = '#cartomancy-main-container';
const mainContainer = document.querySelector(mainContainerSelector);

const section1Selector = '#cartomancy-section-1';
const section2Selector = '#cartomancy-section-2';
const section3Selector = '#cartomancy-section-3';
const popupSelector = '.popup-container';
const spreadSelector = '.spread-btn-container .spread-btn';
const cardsSelector = '.cards-container .card';
const resultContainerSelector = '#cartomancy-section-3 .result-container';

let selectedSpread, selectedCard;

// Required Steps
// click on the arrow button -> open popup

function toggleElementVisibility(elementSelector) {
    const elementContainer = mainContainer.querySelector(`${elementSelector}`);
    const currentStatus = elementContainer.dataset.visibility;

    if (currentStatus == 'hidden') {
        elementContainer.dataset.visibility = 'visible';
    } else {
        elementContainer.dataset.visibility = 'hidden';
    }
}

// click on the popup submit button after entering the question -> close popup, hide section 1, show section 2

function quesSubmit() {
    toggleElementVisibility(popupSelector);
    toggleElementVisibility(section1Selector);
    toggleElementVisibility(section2Selector);
    observeSpread(spreadSelector);
    observeCards(cardsSelector);
}


// check whether spread and card are seleted or not. If spread and card selected get the selected spread number and selected card name.

function observeSpread(spreadSelector) {
    const spreads = mainContainer.querySelectorAll(spreadSelector);
    console.log('spread under observation')

    for (let spread of spreads) {
        spread.addEventListener('click', function () {
            selectedSpread = this.dataset.spread;
            for (let allSpread of spreads) {
                allSpread.dataset.selected = false;
            }
            this.dataset.selected = true;

            if (isBothSelected()) {
                updateData(selectedCard, selectedSpread)
            }
        })
    }
}

function observeCards(cardsSelector) {
    const cards = mainContainer.querySelectorAll(cardsSelector);
    console.log('cards under observation')

    for (let card of cards) {
        card.addEventListener('click', function () {
            if (this.dataset.choosen == 'true') {
                selectedCard = this.dataset.cardNum;
            } else {
                selectedCard = undefined;
            }

            if (isBothSelected()) {
                updateData(selectedCard, selectedSpread)
            }
        })
    }
}

function isBothSelected() {
    if (selectedCard && selectedSpread) {
        return true;
    } else {
        return false;
    }
}

// use the spread number and card name to get the result info from json data
// enter this data into the result container
function updateData(cardNum, spreadNum) {
    console.log('Selected card: ', cardNum);
    console.log('Spread: ', spreadNum);

    const resultContainer = mainContainer.querySelector(resultContainerSelector);

    const cardData = cardsInfo[cardNum]; // dict type
    const spreadData = cardData.spread[spreadNum]; // dict type

    const spreadHtml = createSpreadHTML(spreadData);
    // TODO: create function for creating HTML for spread data
}

// hide section 2 and show section 3