// Import utility functions and configuration
import { getSettings, setSettings } from "./settings.js";
import config from "../config.js";

/**
 * Sets the application theme by updating the settings object.
 * 
 * @param {string} theme - The key of the theme to set.
 */
function setTheme(theme) {
    // Retrieve the current settings from local storage or defaults
    let settings = getSettings();

    // Update the theme property within the settings object
    settings.theme = theme;

    // Persist the updated settings back to storage
    setSettings(settings);
}

/**
 * Retrieves the currently active theme from settings.
 * 
 * @returns {string} The current theme key.
 */
function getCurrentTheme() {
    // Fetch the settings from local storage
    let settings = getSettings();

    // Return the current theme key
    return settings.theme;
}

/**
 * Retrieves the data for a specific theme from the configuration.
 * 
 * @param {string} theme - The key of the theme whose data is required.
 * @returns {Object} The theme data from configuration.
 */
function getThemeData(theme) {
    // Access and return the specific theme data from the config object
    return config.themes[theme];
}

// Export the theme management functions for use in other modules
export { setTheme, getCurrentTheme, getThemeData };