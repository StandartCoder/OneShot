export function initializeCopy() {
    const rephraseCheckbox = document.getElementById('rephraseCheckbox');
    const copyButton = document.getElementById('wholeWeekButton');
    const copyLog = document.getElementById('logTextbox');

    copyButton.addEventListener('click', () => doCopy(rephraseCheckbox, copyLog));
}

function doCopy(rephraseCheckbox, copyLog) {
    alert('Coming soon!');
}