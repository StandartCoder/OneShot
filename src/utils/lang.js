// Import settings to access the current language setting
import { getSettings, setSettings } from './settings.js';

/**
 * Lists available language codes by checking for corresponding JSON files.
 * Only adds language codes to the list if the JSON file is successfully fetched.
 * 
 * @returns {Promise<string[]>} A promise that resolves to an array of available language codes.
 */
async function listLangs() {
    const langs = [];
    const maybeLangs = [
        // List of potential language codes
        'aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av',
        'ay', 'az', 'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo',
        'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv',
        'cy', 'da', 'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es',
        'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fo', 'fr', 'fy', 'ga',
        'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'hi', 'ho', 'hr',
        'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik',
        'io', 'is', 'it', 'iu', 'ja', 'jv', 'ka', 'kg', 'ki', 'kj',
        'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw',
        'ky', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv',
        'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my',
        'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv',
        'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi', 'pl', 'ps',
        'pt', 'qu', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd',
        'se', 'sg', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr',
        'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti',
        'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug',
        'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi',
        'yo', 'za', 'zh', 'zu'
    ];

    for (const lang of maybeLangs) {
        try {
            // Attempt to fetch the language file
            const response = await fetch(`../../locales/${lang}.json`);
            // If the fetch succeeds, add the language code to the list
            if (response.ok) {
                langs.push(lang);
            }
        } catch (error) {
            // Log an error if the language file is not found
            console.log("No language file found for:", lang);
        }
    }

    return langs;
}

/**
 * Retrieves the currently set language from settings.
 * 
 * @returns {string} The currently selected language code.
 */
function getCurrentLang() {
    const settings = getSettings();
    return settings.language;
}

/**
 * Sets the current language and updates the settings in local storage.
 * 
 * @param {string} lang - The language code to set as the current language.
 */
function setLang(lang) {
    const settings = getSettings();
    settings.language = lang;
    setSettings(settings);
}

/**
 * Fetches language-specific data from a JSON file for a given language code.
 * 
 * @param {string} lang - The language code for which to fetch data.
 * @returns {Promise<Object>} A promise that resolves to the language data object.
 */
async function getLangData(lang) {
    const response = await fetch(`../../locales/${lang}.json`);
    if (!response.ok) {
        throw new Error(`Failed to fetch language data for: ${lang}`);
    }
    return await response.json();
}

// Export functions for use in other parts of the application
export { listLangs, getCurrentLang, setLang, getLangData };