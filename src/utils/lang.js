import { getSettings, setSettings } from './settings.js';

async function listLangs() {
    const langs = [];
    const maybeLangs = ['en', 'de', 'tr']; // adding more languages soon

    for (const lang of maybeLangs) {
        const response = await fetch(`../../locales/${lang}.json`);
        
        if (response.ok)
            langs.push(lang);
    }

    return langs;
}

function getCurrentLang() {
    const settings = getSettings();
    return settings.language;
}

function setLang(lang) {
    const settings = getSettings();
    settings.language = lang;
    setSettings(settings);
}

async function getLangData(lang) {
    const response = await fetch(`../../locales/${lang}.json`);
    const data = await response.json();
    return data;
}

export { listLangs, getCurrentLang, setLang, getLangData };