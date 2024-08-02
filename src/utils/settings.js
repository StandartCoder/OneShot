const defaultSettings = {
    theme: 'light',
    language: 'en',
    email: '',
    password: '',
};

function getSettings() {
    return JSON.parse(localStorage.getItem('settings')) || defaultSettings;;
}

function setSettings(settings) {
    if (settings === null) {
        localStorage.removeItem('settings');
        return;
    }

    localStorage.setItem('settings', JSON.stringify(settings));
}

export { getSettings, setSettings };