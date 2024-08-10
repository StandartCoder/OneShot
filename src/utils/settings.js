import config from "../config.js";

function getSettings() {
    return JSON.parse(localStorage.getItem('settings')) || config.defaultSettings;;
}

function setSettings(settings) {
    if (settings === null) {
        localStorage.removeItem('settings');
        return;
    }

    localStorage.setItem('settings', JSON.stringify(settings));
}

export { getSettings, setSettings };