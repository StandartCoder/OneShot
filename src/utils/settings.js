// Import default settings from the configuration file
import config from "../config.js";

/**
 * Retrieves the application settings from local storage or returns default settings.
 * 
 * @returns {Object} The current settings from local storage or default if none are set.
 */
function getSettings() {
    // Attempt to retrieve the 'settings' item from local storage and parse it as JSON
    const settings = localStorage.getItem('settings');
    
    // Return the parsed settings if available, otherwise use default settings from config
    return settings ? JSON.parse(settings) : config.defaultSettings;
}

/**
 * Saves or updates the application settings in local storage. If the settings object
 * is null, it removes the settings from local storage.
 * 
 * @param {Object|null} settings - The settings object to be saved, or null to clear settings.
 */
function setSettings(settings) {
    if (settings === null) {
        // If the settings are explicitly set to null, remove 'settings' from local storage
        localStorage.removeItem('settings');
    } else {
        // Convert the settings object to a JSON string and store it in local storage
        localStorage.setItem('settings', JSON.stringify(settings));
    }
}

// Export functions for external usage
export { getSettings, setSettings };