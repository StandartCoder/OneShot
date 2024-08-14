/**
 * Converts a string to an ArrayBuffer using UTF-8 encoding.
 * @param {string} str - The string to encode.
 * @returns {ArrayBuffer} The ArrayBuffer encoded from the string.
 */
function strToArrayBuffer(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

/**
 * Converts an ArrayBuffer to a Base64 encoded string.
 * @param {ArrayBuffer} buffer - The ArrayBuffer to convert.
 * @returns {string} The Base64 encoded string.
 */
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

/**
 * Converts a Base64 encoded string to an ArrayBuffer.
 * @param {string} base64 - The Base64 string to convert.
 * @returns {ArrayBuffer} The ArrayBuffer decoded from the Base64 string.
 */
function base64ToArrayBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Generates a cryptographic key using a passphrase and PBKDF2.
 * @param {string} passphrase - The passphrase to use for generating the key.
 * @returns {Promise<CryptoKey>} A promise that resolves to the derived cryptographic key.
 */
async function generateKey(passphrase) {
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        strToArrayBuffer(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: strToArrayBuffer('some_salt'),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        {
            name: 'AES-GCM',
            length: 256
        },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypts a password using AES-GCM with a given passphrase.
 * @param {string} password - The password to encrypt.
 * @param {string} passphrase - The passphrase used to generate the encryption key.
 * @returns {Promise<string>} A promise that resolves to the Base64 encoded encrypted password.
 */
async function encryptPassword(password, passphrase) {
    const key = await generateKey(passphrase);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encryptedContent = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        strToArrayBuffer(password)
    );
    return arrayBufferToBase64(iv) + '.' + arrayBufferToBase64(encryptedContent);
}

/**
 * Decrypts a password encrypted with AES-GCM using a given passphrase.
 * @param {string} encryptedPassword - The Base64 encoded encrypted password.
 * @param {string} passphrase - The passphrase used to generate the decryption key.
 * @returns {Promise<string|null>} A promise that resolves to the decrypted password or null if decryption fails.
 */
async function decryptPassword(encryptedPassword, passphrase) {
    try {
        const [ivBase64, encryptedBase64] = encryptedPassword.split('.');
        const key = await generateKey(passphrase);
        const iv = base64ToArrayBuffer(ivBase64);
        const encryptedContent = base64ToArrayBuffer(encryptedBase64);
        const decryptedContent = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encryptedContent
        );
        const decoder = new TextDecoder();
        return decoder.decode(decryptedContent);
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
}

// Export the encryption and decryption functions
export { encryptPassword, decryptPassword };