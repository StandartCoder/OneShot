// Import configuration data from a local module
import config from "../config.js";

/**
 * Retrieves a specific preset by its name from the application's configuration.
 * 
 * @param {string} name - The unique identifier of the preset to retrieve.
 * @returns {Object} The preset object if found, undefined otherwise.
 */
function getPreset(name) {
    // Access and return the preset data from the configuration if it exists
    return config.presets[name];
}

// Export the getPreset function to make it available for import in other modules
export { getPreset };