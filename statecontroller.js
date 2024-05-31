// Current state of the extension
let state = 'login';
const states = ['login', 'account', 'passwordgen'];

/**
 * @returns {string} The current state of the extension
 */
function getState() {
    return {state:state};
}

/**
 * Set the user as logged in and go to the default state (account)
 * @returns {string} The new state of the extension
 */
function setLoggedIn() {
    if(state === 'login'){
        setState('account');
    }
    return {state:state};
}

/**
 * Set the user as logged out and go to the login state
 * @returns {string} The new state of the extension
 */
function setLoggedOut() {
    return setState('login');
}

/**
 * Set the state of the extension to the specified state.
 * This triggers a runtime message 'newState' with the new state.
 * @param {string} newState 
 * @returns {string} The new state of the extension
 */
function setState(newState) {
    if (states.includes(newState)) {
        state = newState;
        console.log('State set to ' + newState);
    }
    browser.runtime.sendMessage({ action: 'newState', state });
    return {state:state};
}

// Listen for messages from other scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'getState':
            sendResponse({ state });
            break;
        case 'setState':
            sendResponse(setState(message.state));
            break;
        case 'loggedIn':
            sendResponse(setLoggedIn());
            break;
        case 'loggedOut':
            sendResponse(setLoggedOut());
            break;
    }
});