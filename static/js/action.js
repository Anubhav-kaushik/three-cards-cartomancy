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

const imgBaseUrl = 'infographics/interative-names/';

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

function checkInputValue(inputSelector, btnSelector) {
    const input = mainContainer.querySelector(inputSelector);
    const btn = mainContainer.querySelector(btnSelector);

    const value = input.value;
    console.log('value: ', value);

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
        console.log('Input changed')
        checkInputValue(inputSelector, btnSelector);
    })
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
// hide section 2 and show section 3

function updateData(cardNum, spreadNum) {
    console.log('Selected card: ', cardNum);
    console.log('Spread: ', spreadNum);

    const resultContainer = mainContainer.querySelector(resultContainerSelector);

    const cardData = cardsInfo[cardNum - 1]; // dict type
    const spreadData = cardData.spread[spreadNum]; // dict type

    const column1 = resultContainer.querySelector('#column-1');
    const column1ImgSource = column1.querySelector('source');
    const webpSrc = `${imgBaseUrl}webp/${cardData.images.webp}`;
    column1ImgSource.setAttribute('src', webpSrc);
    const column1Img = column1.querySelector('img');
    const jpgSrc = `${imgBaseUrl}jpg/${cardData.images.jpg}`;
    column1Img.setAttribute('src', jpgSrc);
    const column1Para = column1.querySelector('p');
    column1Para.innerHTML = cardData.heading;

    const spreadHtml = createSpreadHTML(spreadData);
    const column2 = resultContainer.querySelector('#column-2');
    column2.outerHTML = spreadHtml.outerHTML;

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