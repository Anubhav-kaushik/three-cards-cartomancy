let visibleSection = 1;

function scrollToHeader(headerSelector='.tarot--header') {
    let header = document.querySelector(headerSelector);
    header.scrollIntoView({behavior: 'smooth'});
}

function showHideSections(visibleSectionNum, sectionSelector='.tarot--section') {
    /*
        This function show or hide the sections.
        visibleSectionNum: The section you want to show.
    */
    const sections = document.querySelectorAll(sectionSelector);
    for (let section of sections) {
        if (section.dataset.section == visibleSectionNum) {
            section.dataset.isvisible = true;
        } else {
            section.dataset.isvisible = false;
        }
    }
}

function squeezeSection(section) {
    /*
        This function squeeze the section.
        section: The section you want to squeeze.
    */
    section.style.height = '0px';
    section.style.minHeight = '0px';
}

/* spread choice selection */
let selectedSpread;
function selectChoice(choiceElement, spreadSelector='.spread-btn[data-choosen="true"]') {
    /*
        This function select the choice element.
        choiceElement: The choice element you want to select.
    */
    const selectedChoices = document.querySelectorAll(spreadSelector);
    for (let selectedChoice of selectedChoices) {
        selectedChoice.dataset.choosen = false;
    }
    choiceElement.dataset.choosen = true;
}

function spreadDescription(spread, resultContentContainer) {
    // need some changes
    const description = document.querySelector('.tarot--spread-description');
    const para = document.createElement('p');
    para.innerHTML = spreadData[spread];
    description.innerHTML = '';
    description.append(para);
}

function disableSubmitButton(buttonSelector='#submit-btn') {
    const submitButton = document.querySelector(buttonSelector);
    submitButton.disabled = true;
}

function enableSubmitButton(buttonSelector='#submit-btn') {
    const submitButton = document.querySelector(buttonSelector);
    submitButton.disabled = false;
}

function resetSpread(allChoices) {
    for (let card of allChoices) {
        card.dataset.choosen = "false";
    }
}

function resetDescription() {
    const description = document.querySelector('.tarot--spread-description');
    description.innerHTML = '';
    selectedSpread = undefined;
}

function resetInputField(inputSelector) {
    const inputField = document.querySelector(inputSelector);
    inputField.value = '';
}

resetInputField('#user-question');

const spreadSelector = '.tarot--spread-choices>.tarot--btn';
const allChoices = document.querySelectorAll(spreadSelector);

if (selectedSpread == undefined) {
    disableSubmitButton();
}

for (let choice of allChoices) {
    choice.addEventListener('click', function () {
        selectChoice(this);
        selectedSpread = this.dataset.spread;
        spreadDescription(selectedSpread); // add spread description
        enableSubmitButton();
    });
}

async function onClickSubmit() {
    secondSectionLoaded(selectedSpread);
    scrollToHeader();
    setTimeout(() => {
      showHideSections(2);
    }, 1000);
    visibleSection = 2;
}


