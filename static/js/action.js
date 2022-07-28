// jsondata --> cardsInfo

const mainContainerSelector = '#cartomancy-main-container';
const mainContainer = document.querySelector(mainContainerSelector);

const section1Selector = '#cartomancy-section-1';
const section2Selector = '#cartomancy-section-2';
const section3Selector = '#cartomancy-section-3';
const popupSelector = '.popup-container';
const popupInputSelector = '#popup-input';
const popupBtnSelector = '#popup-btn';
const spreadSelector = '.spread-btn-container .spread-btn';
const cardsSelector = '.cards-container .card';
const resultContainerSelector = '#cartomancy-section-3 .result-container';

const imgBaseUrl = 'infographics/interactive-names/';

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
let observerInterval;

function quesSubmit() {
    toggleElementVisibility(popupSelector);
    toggleElementVisibility(section1Selector);
    toggleElementVisibility(section2Selector);
    
    observerInterval = setInterval(function () {
        observeCards();
        isBothSelected();
    }, 500);
}

function checkInputValue(inputSelector, btnSelector) {
    const input = mainContainer.querySelector(inputSelector);
    const btn = mainContainer.querySelector(btnSelector);

    const value = input.value;

    if (value) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function observeInputValue(inputSelector, btnSelector) {
    const input = mainContainer.querySelector(inputSelector);

    checkInputValue(inputSelector, btnSelector);

    input.addEventListener('change', (event) => {
        checkInputValue(inputSelector, btnSelector);
    })
}


// check whether spread and card are seleted or not. If spread and card selected get the selected spread number and selected card name.

function changeSpreadStatus(clickedSpread) {
    const spreads = mainContainer.querySelectorAll(spreadSelector);
    console.log('spread under observation')

    for (let spread of spreads) {
        spread.dataset.selected = false;
    }

    clickedSpread.dataset.selected = true;

    observeSpread(spreadSelector);
}

function observeSpread(spreadSelector) {
    const spreads = mainContainer.querySelectorAll(spreadSelector);

    for (let spread of spreads) {
        if (spread.dataset.selected == 'true') {
            selectedSpread = spread.dataset.spread;
        }
    }
}

function observeCards() {
    const cards = mainContainer.querySelectorAll(cardsSelector);
    selectedCard = undefined;

    for (let card of cards) {
        if (card.dataset.choosen == 'true') {
            selectedCard = card.dataset.cardNum;
        }
    }
}

function isBothSelected() {
    if (selectedCard && selectedSpread) {
        console.log('both selected')
        updateData(selectedCard, selectedSpread)
        
        clearInterval(observerInterval);
    }
}

// use the spread number and card name to get the result info from json data
// enter this data into the result container
// hide section 2 and show section 3

function updateData(cardNum, spreadNum) {
    const resultContainer = mainContainer.querySelector(resultContainerSelector);

    const cardData = cardsInfo[cardNum - 1]; // dict type
    const spreadData = cardData.spread[spreadNum]; // dict type

    const column1 = resultContainer.querySelector('#column-1');
    const column1ImgSource = column1.querySelector('source');
    const webpSrc = `${imgBaseUrl}cards/webp/${cardData.images.webp}`;
    column1ImgSource.setAttribute('src', webpSrc);
    const column1Img = column1.querySelector('img');
    const jpgSrc = `${imgBaseUrl}cards/png/${cardData.images.png}`;
    column1Img.setAttribute('src', jpgSrc);
    const column1Para = column1.querySelector('p');
    column1Para.innerHTML = cardData.heading;

    const spreadHtml = createSpreadHTML(spreadData);
    const column2 = resultContainer.querySelector('#column-2');
    column2.outerHTML = spreadHtml.outerHTML;

    console.log('Toggling');
    toggleElementVisibility(section2Selector);
    toggleElementVisibility(section3Selector);
}

function createSpreadHTML(spreadData) {
    const spreadContainer = document.createElement('div');
    spreadContainer.classList.add('column');
    spreadContainer.id = 'column-2';

    for (let key in spreadData) {
        const row = document.createElement('div');
        row.classList.add('row');

        const heading = document.createElement('h3');
        heading.dataset.color = 'primary';
        heading.innerHTML = key;
        row.append(heading);

        const para = document.createElement('p');
        para.innerHTML = spreadData[key];
        row.append(para);

        spreadContainer.append(row);
    }

    return spreadContainer
}

// replay

function resetInputField(inputSelector) {
    const input = mainContainer.querySelector(inputSelector);
    input.value = '';
}

function resetSpreadBtn(spreadSelector) {
    const spreads = mainContainer.querySelectorAll(spreadSelector);

    for (let spread of spreads) {
        spread.dataset.selected = false;
    }
}

function resetGame() {
    toggleElementVisibility(section3Selector)
    toggleElementVisibility(section1Selector)

    // empty input field
    resetInputField(popupInputSelector)

    // reset spread btn
    resetSpreadBtn(spreadSelector)

    // reset card position
    resetCardsPosition()

    selectedSpread = undefined;
    selectedCard = undefined;
}

resetInputField(popupInputSelector)
