async function getKeyFromPassword(password) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode("unique-salt"), // Use a unique salt per user/session
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
    return key;
}

function getKey() {
    return browser.storage.local.get('password').then((data) => {
        if (data.password) {
            return getKeyFromPassword(data.password);
        } else {
            return null;
        }
    });
}

function setKey(password) {
    return getKeyFromPassword(password).then((key) => {
        return browser.storage.local.set({ password });
    });
}

async function encryptPassword(password) {
    // Get the key from storage
    const key = await getKey();
    if (!key) 
        return null;

    // Encrypt the password
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV
    const encodedPassword = enc.encode(password);
    const encryptedPassword = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedPassword
    );

    // Convert the encrypted password to a base64 string
    let encryptedPwdArray = new Uint8Array(encryptedPassword);
    
    // Combine the IV and the encrypted password
    const ivAndEncrypted = new Uint8Array(iv.length + encryptedPwdArray.length);
    ivAndEncrypted.set(iv);
    ivAndEncrypted.set(encryptedPwdArray, iv.length);
    
    // Return the base64 encoded string
    return btoaUint8Array(ivAndEncrypted);
}

function btoaUint8Array(uint8Array) {
    return btoa(String.fromCharCode.apply(null, uint8Array));
}

function decodeBase64(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decryptPassword(encryptedData) {
    // Get the key from storage
    const key = await getKey();
    if (!key) 
        return null;

    // Split the IV and the encrypted password
    const encrypted64 = decodeBase64(encryptedData);
    const iv = encrypted64.slice(0, 12);
    const data64 = encrypted64.slice(12);

    // Decrypt the password
    const dec = new TextDecoder();
    const decryptedPassword = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        data64
    );

    return dec.decode(decryptedPassword);
}
