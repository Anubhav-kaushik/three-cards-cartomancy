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

let selectedSpread;
let selectedCards = [];
let isMaxCardSelected = false;
let inputCheckFlag = true;
let btnEnabled = false;

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

    inputCheckFlag = false;
}

function checkInputValue(input, btnSelector) {
    const btn = mainContainer.querySelector(btnSelector);

    const value = input.value;

    if (value.length > 4) {
        btn.disabled = false;
        btnEnabled = true;
    } else {
        btn.disabled = true;
        btnEnabled = false;
    }
}

addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && btnEnabled) {
        quesSubmit();
    }
})

async function observeInputValue(inputSelector, btnSelector) {
    const input = mainContainer.querySelector(inputSelector);

    inputCheckFlag = true;

    while(inputCheckFlag) {
        checkInputValue(input, btnSelector);
        await sleep(0.1)
    }
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
    selectedCards = [];
    isMaxCardSelected = false;

    let count = 0;
    for (let card of cards) {
        if (card.dataset.choosen == 'true') {
            count++;
            selectedCards.push(card.dataset.cardNum);
        }
    }

    if (count == 3) {
        isMaxCardSelected = true;
    }
}

function isBothSelected() {
    if (isMaxCardSelected && selectedSpread) {
        console.log('both selected')
        updateData(selectedCards, selectedSpread)
        
        clearInterval(observerInterval);
    }
}

// use the spread number and card name to get the result info from json data
// enter this data into the result container
// hide section 2 and show section 3

function updateData(cardNums, spreadNum) {
    const resultContainers = mainContainer.querySelectorAll(resultContainerSelector);

    for (let i = 0; i < resultContainers.length; i++) {
        let cardNum = cardNums[i];
        const cardData = cardsInfo[cardNum - 1];

        const spreadValues = Object.keys(cardData.spread[spreadNum]);
        
        const spreadDataKey = spreadValues[i];
        const spreadData = {};
        spreadData[spreadDataKey] = cardData.spread[spreadNum][spreadDataKey];

        createResultContainer(cardData, spreadData, resultContainers[i]);
    }

    console.log('Toggling');
    toggleElementVisibility(section2Selector);
    toggleElementVisibility(section3Selector);

    reachIntoView('#psychic-source-logo')
}

function createResultContainer(cardData, spreadData, container) {
    const column1 = container.querySelector('#column-1');
    const column1ImgSource = column1.querySelector('source');
    const webpSrc = `${imgBaseUrl}cards/webp/${cardData.images.webp}`;
    column1ImgSource.setAttribute('src', webpSrc);
    const column1Img = column1.querySelector('img');
    const jpgSrc = `${imgBaseUrl}cards/png/${cardData.images.png}`;
    column1Img.setAttribute('src', jpgSrc);
    const column1Para = column1.querySelector('p');
    column1Para.innerHTML = cardData.heading;

    const spreadHtml = createSpreadHTML(spreadData);
    const column2 = container.querySelector('#column-2');
    column2.outerHTML = spreadHtml.outerHTML;
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
        heading.dataset.fontFamily = 'cb';
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
    reachIntoView('#psychic-source-logo')

    // empty input field
    resetInputField(popupInputSelector)

    // reset spread btn
    resetSpreadBtn(spreadSelector)

    // reset card position
    resetCardsPosition()

    selectedSpread = undefined;
    selectedCards = [];
    isMaxCardSelected = false;
}

resetInputField(popupInputSelector)
