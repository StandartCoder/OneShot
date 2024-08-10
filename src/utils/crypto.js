function strToArrayBuffer(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

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

async function encryptPassword(password, passphrase) {
    const key = await generateKey(passphrase);
    const iv = crypto.getRandomValues(new Uint8Array(12));
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
        return null;
    }
}

export { encryptPassword, decryptPassword };