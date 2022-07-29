async function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

function reachIntoView(elementSelector) {
    const element = document.querySelector(elementSelector);

    options = {
        behaviour: 'smooth',
        block: 'center',
        inline: 'center'
    }

    element.scrollIntoView(options)
}