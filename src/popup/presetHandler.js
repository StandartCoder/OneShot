import { getPreset } from '../utils/presets.js';

/**
 * Initializes event handlers for the preset application.
 */
export function initializePreset() {
    const presetSelect = document.getElementById('presetSelect');
    const presetButton = document.getElementById('usePresetButton');

    presetButton.addEventListener('click', () => doPreset(presetSelect, presetButton));
}

/**
 * Handles the preset application process.
 * Disables UI components and checks if the current site is correct before proceeding.
 * @param {HTMLElement} select - The select element for choosing presets.
 * @param {HTMLElement} button - The button to trigger presets.
 */
async function doPreset(select, button) {
    select.disabled = true;
    button.disabled = true;

    await new Promise(resolve => setTimeout(resolve, 250));

    const url = await getCurrentTabUrl();
    const checkIfOnRightSite = url.includes('berichtsheft');

    if (!checkIfOnRightSite) {
        select.disabled = false;
        button.disabled = false;
        return;
    }

    const selected = select.value;
    const preset = getPreset(selected);

    for (let i = 1; i < 6; i++) {
        await applyPresetActions(i, preset);
    }

    await new Promise(resolve => setTimeout(resolve, 250));

    select.disabled = false;
    button.disabled = false;
}

/**
 * Applies preset actions based on selected preset options.
 * @param {number} dayIndex - The index of the day to apply presets to.
 * @param {Object} preset - The preset data object.
 */
async function applyPresetActions(dayIndex, preset) {
    const basePath = `/html[1]/body[1]/app-spb-root[1]/app-spb-app-layout[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/main[1]/app-spb-web-component[1]/dibe-root[1]/lib-spb-berichtsheft[1]/lib-spb-berichtsheft-woche[1]/div[1]/mat-tab-group[1]/div[1]/mat-tab-body[1]/div[1]/lib-spb-berichtsheft-tagesbasis[1]/lib-spb-berichtsheft-tages-bericht[${dayIndex}]/div[1]`;

    // Apply various preset actions sequentially.
    await clearDay(basePath);
    await setPresence(basePath, preset);

    if (preset.ort) {
        await setLocation(basePath, preset);
    }

    if (preset.eintrag) {
        await setEntry(basePath, preset);
    }

    if (preset.dauer) {
        await setDuration(basePath, preset);
    }

    if (preset.punkte) {
        await setPoints(basePath, preset);
    }
}

/**
 * Clears the day's entries on the webpage.
 * @param {string} basePath - The base XPath to the specific day's controls.
 */
async function clearDay(basePath) {
    const clearButtonXPath = `${basePath}/mat-card[1]/mat-card-actions[1]/button[1]/span[4]`;
    await clickElementByXPath(clearButtonXPath);
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate a short delay for DOM updates
}

/**
 * Sets the presence for the day.
 * @param {string} basePath - The base XPath to the specific day's controls.
 * @param {Object} preset - The preset data containing the presence setting.
 */
async function setPresence(basePath, preset) {
    const presenceXPath = `${basePath}/mat-card[1]/mat-card-title[1]/div[1]/mat-form-field[1]/div[1]`;
    await clickElementByXPath(presenceXPath);
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for dropdown to appear

    for (let i = 0; i < 10; i++) {
        const presenceItemXPath = `/html[1]/body[1]/div[${i}]/div[2]/div[1]/div[1]/mat-option[${preset.anwesenheit}]`;
        await clickElementByXPath(presenceItemXPath);
    }

    await new Promise(resolve => setTimeout(resolve, 100)); // Allow time for selection to register
}

/**
 * Sets the location for the day.
 * @param {string} basePath - The base XPath to the specific day's controls.
 * @param {Object} preset - The preset data containing the location setting.
 */
async function setLocation(basePath, preset) {
    const locationXPath = `${basePath}/mat-card[1]/mat-card-title[1]/div[1]/mat-form-field[2]/div[1]/div[1]/div[2]`;
    await clickElementByXPath(locationXPath);
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for dropdown to appear

    for (let i = 0; i < 10; i++) {
        const locationItemXPath = `/html[1]/body[1]/div[${i}]/div[2]/div[1]/div[1]/mat-option[${preset.ort}]`;
        await clickElementByXPath(locationItemXPath);
    }

    await new Promise(resolve => setTimeout(resolve, 100)); // Allow time for selection to register
}

/**
 * Sets an entry for the day.
 * @param {string} basePath - The base XPath to the specific day's controls.
 * @param {Object} preset - The preset data containing the entry setting.
 */
async function setEntry(basePath, preset) {
    const entryXPath = `${basePath}/mat-card[1]/mat-card-content[1]/div[1]/div[1]/div[1]/button[1]/span[4]`;
    await clickElementByXPath(entryXPath);
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for action to complete

    for (let i = 0; i < 10; i++) {
        const entryItemXPath = `/html[1]/body[1]/div[${i}]/div[2]/div[1]/div[1]/div[1]/button[${preset.eintrag}]`;
        await clickElementByXPath(entryItemXPath);
    }

    await new Promise(resolve => setTimeout(resolve, 100)); // Allow time for selection to register
}

/**
 * Sets the duration for the day.
 * @param {string} basePath - The base XPath to the specific day's controls.
 * @param {Object} preset - The preset data containing the duration setting.
 */
async function setDuration(basePath, preset) {
    const durationXPath = `${basePath}/mat-card[1]/mat-card-content[1]/div[1]/div[1]/div[1]/div[2]/div[1]/lib-spb-timepicker[1]/ngx-mat-timepicker-field[1]/div[1]/ngx-mat-timepicker-time-control[1]/mat-form-field[1]/div[1]/div[2]/div[2]/div[1]/span[1]`;
    for (let j = 0; j < preset.dauer; j++) {
        await clickElementByXPath(durationXPath);
        await new Promise(resolve => setTimeout(resolve, 15)); // Simulate fast clicking for duration setting
    }
    await new Promise(resolve => setTimeout(resolve, 100)); // Ensure last input is registered
}

/**
 * Sets points for the day's entry.
 * @param {string} basePath - The base XPath to the specific day's controls.
 * @param {Object} preset - The preset data containing points setting.
 */
async function setPoints(basePath, preset) {
    const pointsXPath = `${basePath}/mat-card[1]/mat-card-content[1]/div[1]/div[1]/div[1]/div[1]/lib-spb-richtext[1]/ckeditor[1]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/button[5]`;
    await clickElementByXPath(pointsXPath);
    await new Promise(resolve => setTimeout(resolve, 100)); // Allow time for points to be set
}

/**
 * Function to click an element by its XPath.
 * @param {string} xpath - The XPath of the element to be clicked.
 * @returns {Promise<void>} A promise that resolves when the script is executed.
 */
function clickElementByXPath(xpath) {
    return new Promise((resolve, reject) => {
        // Function to execute the script in the active tab
        function executeScript(tabId) {
            const scriptDetails = {
                target: { tabId: tabId },
                function: clickByXPath,
                args: [xpath]
            };
            
            if (typeof chrome !== "undefined" && chrome.scripting && chrome.scripting.executeScript) {
                chrome.scripting.executeScript(scriptDetails, resolve);
            } else if (typeof browser !== "undefined" && browser.scripting && browser.scripting.executeScript) {
                browser.scripting.executeScript(scriptDetails).then(resolve, reject);
            } else {
                reject(new Error("Unsupported browser"));
            }
        }

        // Query the active tab
        if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    executeScript(tabs[0].id);
                } else {
                    reject(new Error("No active tab found"));
                }
            });
        } else if (typeof browser !== "undefined" && browser.tabs && browser.tabs.query) {
            browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
                if (tabs.length > 0) {
                    executeScript(tabs[0].id);
                } else {
                    reject(new Error("No active tab found"));
                }
            }, reject);
        } else {
            reject(new Error("Unsupported browser"));
        }
    });
}

/**
 * Helper function to click an element by XPath within the page.
 * @param {string} xpath - The XPath of the element to be clicked.
 */
function clickByXPath(xpath) {
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
        element.click();
    } else {
        console.error(`Element with XPath was not found: ${xpath}`);
    }
}

/**
 * Gets the current tab's URL.
 * @returns {Promise<string>} The URL of the current tab.
 */
function getCurrentTabUrl() {
    // Define a helper that performs the query
    function queryTabs(callback) {
        // Check if the 'chrome' namespace exists, which is used by Chrome
        if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
            chrome.tabs.query({ active: true, currentWindow: true }, callback);
        }
        // Check if the 'browser' namespace exists, which is used by Firefox and some other browsers
        else if (typeof browser !== "undefined" && browser.tabs && browser.tabs.query) {
            browser.tabs.query({ active: true, currentWindow: true }).then(callback);
        } else {
            throw new Error("Browser does not support the 'tabs' API");
        }
    }

    return new Promise((resolve) => {
        queryTabs((tabs) => {
            if (tabs.length > 0) {
                resolve(tabs[0].url);
            } else {
                resolve(null);
            }
        });
    });
}