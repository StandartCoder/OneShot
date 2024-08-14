// Import functions to initialize event handlers
import { initializeEventHandlers } from './eventHandlers.js';
import { initializeHandlers } from './handlers.js';

/**
 * Sets up the initialization of event handlers after the DOM content has fully loaded.
 * This ensures all DOM elements are available for bindings.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Initialize general event handlers
    initializeEventHandlers();

    // Initialize additional handlers for tasks
    initializeHandlers();
});